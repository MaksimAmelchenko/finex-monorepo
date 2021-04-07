CREATE OR REPLACE FUNCTION "cf$_invitation".accept(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vId_User_Host  core$.User.Id_User%type;
  vId_Invitation cf$.Invitation.Id_Invitation%type;
  vCount         int;
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
    select i.Id_User_Host
      into strict vId_User_Host
      from cf$.v_Invitation i
     where i.Id_Invitation = vId_Invitation;
  exception
    when no_data_found then
      perform error$.raise ('no_data_found', iMessage := 'Приглашение не найдено');
  end;

  -- Проверяем, может ли текущий пользователь принять приглашение (один ли он домохозяйстве)
  select count(*)
    into vCount
    from core$.v_User;

  if vCount > 1 then
    perform error$.raise ('bad_request', iMessage := 'Приглашение не может быть принято, так как Вы уже ведете совместную бухгалтерию с другими пользователями');
  end if;    

  update core$.user u
     set Id_Household = (select ui.Id_Household 
                           from core$.User ui 
                          where ui.Id_User = vId_User_Host)
   where u.Id_User = context.get('Id_User')::int;
   
  delete 
    from cf$.Household h
   where h.Id_Household = context.get('Id_Household')::int;

  delete
    from cf$.Invitation i
   where i.Id_Invitation = vId_Invitation;
   
  oResult := '';
end;
$function$
