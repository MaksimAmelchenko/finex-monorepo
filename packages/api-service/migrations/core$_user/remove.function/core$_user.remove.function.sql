CREATE OR REPLACE FUNCTION "core$_user".remove(iid_user integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  -- Отлючаем контроль прав доступа
/*  alter table cf$.account         disable trigger account_aud_check_permit;
  alter table cf$.account_permit  disable trigger account_permit_aiud_check_permit;
  alter table cf$.account_balance disable trigger account_balance_aiud_check_permit;

  alter table cf$.project         disable trigger project_aud_check_permit;
  alter table cf$.project_permit  disable trigger project_permit_aiud_check_permit;
*/  
  perform context.set ('isNotCheckPermit', '1'); 

  begin
    delete from core$.user 
          where Id_User = iId_User;
    perform context.set ('isNotCheckPermit', ''); 
  exception
    when others then
      perform context.set ('isNotCheckPermit', ''); 
      raise;
  end;

        
/*  alter table cf$.account         enable trigger account_aud_check_permit;
  alter table cf$.account_permit  enable trigger account_permit_aiud_check_permit;
  alter table cf$.account_balance enable trigger account_balance_aiud_check_permit;

  alter table cf$.project         enable trigger project_aud_check_permit;
  alter table cf$.project_permit  enable trigger project_permit_aiud_check_permit;
*/
end;
$function$
