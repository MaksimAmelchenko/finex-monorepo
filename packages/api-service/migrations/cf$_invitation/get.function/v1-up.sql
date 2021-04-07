CREATE OR REPLACE FUNCTION "cf$_invitation".get(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vResult  json;
  vId_Invitation cf$.Invitation.Id_Invitation%type;
begin
  begin
    vId_Invitation := (iParams->>'idInvitation')::int;
  exception
    when others
    then
      perform error$.raise ('invalid_parameters');
  end;

  with i as (select i.Id_Invitation as "idInvitation",
                    i.Id_User_Host as "idUserHost",
                    i.EMail_Host as "emailHost",
                    i.message
               from cf$.v_Invitation i
              where i.Id_Invitation = coalesce (vId_Invitation, i.Id_Invitation))
               
  select json_agg(i)
    into vResult
    from i;

  if vId_Invitation is null then
    oResult := concat ('"invitations"', ':', coalesce(vResult::text,'[]'));
  else
    oResult := concat ('"invitation"', ':', coalesce (vResult->>0, '{}'));
  end if;
  
end;
$function$
