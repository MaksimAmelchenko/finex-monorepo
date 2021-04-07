CREATE OR REPLACE FUNCTION "cf$".account_permit_biud_check_permit()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare
  vId_Account    cf$.Account.Id_Account%type;
  vId_Project    cf$.Project.Id_Project%type;
  vAccount_Name  cf$.Account.Name%type;
begin
  if TG_OP = 'INSERT'
  then
    if new.Id_Project is null then
      new.Id_Project := context.get('Id_Project')::int;
    end if;
  end if;

  if context.get ('isNotCheckPermit') is null 
  then
    if TG_OP in ('INSERT', 'UPDATE') 
    then
      vId_Account := new.Id_Account;
      vId_Project := new.Id_Project;
    else
      vId_Account := old.Id_Account;
      vId_Project := old.Id_Project;
    end if;

    vAccount_Name := cf$_account.get_name (vId_Project, vId_Account);

    -- Если это каскадное удаление, то записи в Account уже нет и значит
    -- проверка на права уже прошла там
    
    if     cf$_account.get_Permit (vId_Project, vId_Account) & 7 != 7 
       and vAccount_Name is not null 
    then
      perform error$.raise ('permission_denied');
    end if;
  end if;

  if TG_OP in ('INSERT', 'UPDATE') 
  then
    return new;
  else
    return old;
  end if; 
end;
$function$
