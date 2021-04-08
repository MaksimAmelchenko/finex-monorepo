CREATE OR REPLACE FUNCTION "cf$".cashflow_detail_biud()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare
  r              record;
  vId_Accounts   int[];
  vId_Project    int;
begin
  if TG_OP = 'INSERT'
  then
    if new.Id_User is null 
    then
      new.Id_User := context.get('Id_User')::int;
    end if;
    
    if new.Id_Project is null 
    then
      new.Id_Project := context.get('Id_Project')::int;
    end if;
    
    if new.report_period is null 
    then
      new.report_period := date_trunc('month', new.DCashFlow_Detail);
    end if;
  end if;

  if TG_OP in ('INSERT', 'UPDATE') 
  then
    new.report_period := date_trunc('month', new.report_period);
  end if;

  if context.get ('isNotCheckPermit') is null 
  then
    vId_Accounts := '{}';

    -- Проверяем права на старый и на новый счет  
    if TG_OP in ('INSERT', 'UPDATE') 
    then
      vId_Accounts := vId_Accounts || array[new.Id_Account];
      vId_Project := new.Id_Project;
    end if;
    
    if TG_OP in ('UPDATE', 'DELETE') 
    then
      vId_Accounts := vId_Accounts || array[old.Id_Account];
      vId_Project := old.Id_Project;
    end if;

    -- Если это каскадное удаление, то записи в Account уже нет и значит
    -- проверка на права уже прошла там
    for r in (select cf$_account.get_Permit (a.Id_Project, a.Id_Account) as Permit,
                     a.Name
                from     (select unnest(vId_Accounts) Id_Account) o
                     join cf$.Account a on (    a.Id_Project = vId_Project
                                            and a.Id_Account = o.Id_Account)) 
    loop
      if (r.Permit & 3) != 3
      then
        perform error$.raise ('permission_denied', 
                              iMessage := 'У Вас нет прав на изменение транзации по счету "' || 
                                          case when r.Permit = 1 then r.Name else '<нет доступа>' end || '"');
      end if;
    end loop;
  end if;

  if TG_OP in ('INSERT', 'UPDATE') 
  then
    return new;
  else
    return old;
  end if; 
end;
$function$
