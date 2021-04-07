CREATE OR REPLACE FUNCTION "cf$_invitation".reject(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vId_Invitation cf$.Invitation.Id_Invitation%type;
begin
  if (iParams \? 'idInvitation') then
    begin
      vId_Invitation = (iParams->>'idInvitation')::int;
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idInvitation" must be a number');
    end;
  end if;

  if vId_Invitation is null then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idInvitation" is required');
  end if;

  begin
    select i.Id_Invitation
      into strict vId_Invitation
      from cf$.v_Invitation i
     where i.Id_Invitation = vId_Invitation;
  exception
    when no_data_found then
      perform error$.raise ('no_data_found', iMessage := 'Приглашение не найдено');
  end;

  delete
    from cf$.Invitation i
   where i.Id_Invitation = vId_Invitation;

  oResult := '';
end;
$function$
