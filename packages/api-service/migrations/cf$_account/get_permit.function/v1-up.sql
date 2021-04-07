CREATE OR REPLACE FUNCTION "cf$_account".get_permit(iid_project integer, iid_account integer, OUT opermit smallint)
 RETURNS smallint
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  begin
    select Permit
      into strict oPermit
      from cf$_account.permit(iId_Project) 
     where Id_Account = iId_Account;
  exception
    when no_data_found then
      oPermit := 0;
  end;
end;
$function$
