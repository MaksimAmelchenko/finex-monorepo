CREATE OR REPLACE FUNCTION "cf$"."#account_balance_biud_check_permit"()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare
  vId_Account    cf$.Account.Id_Account%type;
  vAccount_Name  cf$.Account.Name%type;
begin
  if context.get ('isNotCheckPermit') is null then
    if TG_OP in ('INSERT', 'UPDATE') then
      vId_Account := new.Id_Account;
    else
      vId_Account := old.Id_Account;
    end if;

    select a.Name
      into vAccount_Name 
      from cf$.Account a
     where a.Id_Account = vId_Account;

    -- Если это каскадное удаление, то записи в Account уже нет и значит
    -- проверка на права уже прошла там
    
    if     cf$_account.get_Permit (vId_Account) & 3 != 3 
       and vAccount_Name is not null then
      perform error$.raise ('permission_denied', iMessage := 'У Вас нет прав на изменение баланса по счету "' || vAccount_Name || '"');
    end if;
  end if;

  if TG_OP in ('INSERT', 'UPDATE') then
    return new;
  else
    return old;
  end if; 

end;
$function$
