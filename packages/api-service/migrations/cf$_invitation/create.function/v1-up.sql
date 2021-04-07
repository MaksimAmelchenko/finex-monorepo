CREATE OR REPLACE FUNCTION "cf$_invitation"."create"(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vInvitation cf$.Invitation%rowtype;
begin
  if (iParams \? 'emailHost') then
    vInvitation.EMail_Host = nullif (trim (iParams->>'emailHost'), '');
  end if;

  if vInvitation.EMail_Host is null then
    perform error$.raise ('invalid_parameters', iDev_Message := '"emailHost" is required');
  end if;

  if (iParams \? 'idUserHost') then
    begin
	    vInvitation.Id_User_Host = (iParams->>'idUserHost')::int;
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idUserHost" must be a number');
    end;
  end if;

  if vInvitation.Id_User_Host is null then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idUserHost" is required');
  end if;

  if (iParams \? 'idUserGuest') then
    begin
	    vInvitation.Id_User_Guest = (iParams->>'idUserGuest')::int;
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idUserGuest" must be a number');
    end;
  end if;

  if vInvitation.Id_User_Guest is null then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idUserGuest" is required');
  end if;

  if (iParams \? 'message') then
    vInvitation.Message = nullif (trim (iParams->>'message'), '');
  end if;
  
  with
    s as (select vInvitation.Id_User_Host as Id_User_Host,
                 vInvitation.Id_User_Guest as Id_User_Guest,
                 vInvitation.EMail_Host as EMail_Host,
                 vInvitation.Message as Message),
    upsert as (update cf$.Invitation i
                  set EMail_Host = s.EMail_Host,
                      Message = s.Message,
                      DSet = clock_timestamp()
                 from s
                where i.Id_User_Host = s.Id_User_Host
                  and i.Id_User_Guest = s.Id_User_Guest
            returning * )
    insert 
      into cf$.Invitation (Id_User_Host, Id_User_Guest, EMail_Host, Message)
    select s.Id_User_Host, s.Id_User_Guest, s.EMail_Host, s.Message
      from s
     where not exists (select 1
                         from upsert);

end;
$function$
