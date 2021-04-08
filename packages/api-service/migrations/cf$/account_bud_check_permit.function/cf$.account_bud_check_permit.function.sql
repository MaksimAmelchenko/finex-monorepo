CREATE OR REPLACE FUNCTION "cf$".account_bud_check_permit()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare
  vId_Account cf$.Account.Id_Account%type;
  vId_Project cf$.Project.Id_Project%type;
begin
  if context.get ('isNotCheckPermit') is null 
  then
    if TG_OP = 'UPDATE' then
      vId_Account := new.Id_Account;
      vId_Project := new.Id_Project;
    else
      vId_Account := old.Id_Account;
      vId_Project := old.Id_Project;
    end if; 

    if cf$_account.get_Permit (vId_Project, vId_Account) != 7 
    then
      perform error$.raise ('permission_denied', iMessage := 'У Вас нет прав на изменение счета "' || old.Name || '"');
    end if;
  end if;
  
  if TG_OP = 'UPDATE' then
    return new;
  else
    return old;
  end if; 
end;
$function$
