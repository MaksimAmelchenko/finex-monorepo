CREATE OR REPLACE FUNCTION "cf$_import"."#get_id_account"(iname text, OUT oid_account integer)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  begin
    select a.Id_Account
      into oId_Account
      from cf$.v_Account a
     where upper(a.name) = upper(iName);
  exception
    when no_data_found then
      oId_Account := null;
  end;     
                
  if oId_Account is null then
    insert into cf$.Account (Name)
         values (iName)
      returning Id_Account
           into oId_Account;
  end if;
end;
$function$
