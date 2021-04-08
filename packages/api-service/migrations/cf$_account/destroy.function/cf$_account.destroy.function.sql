CREATE OR REPLACE FUNCTION "cf$_account".destroy(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vAccount cf$.v_Account%rowtype;
begin

  begin
    vAccount.Id_Account := (iParams->>'idAccount')::int;
  exception
    when others then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idAccount" must be a number');
  end;

  if vAccount.Id_Account is null 
  then
	  perform error$.raise ('invalid_parameters', iDev_Message := '"idAccount" is required');
  end if;

  begin
    select a.*
      into strict vAccount
      from cf$.v_Account a
     where a.Id_Account = vAccount.Id_Account;
  exception
    when no_data_found then
      perform error$.raise ('no_data_found');
  end;

  if cf$_account.get_Permit (vAccount.Id_Project, vAccount.Id_Account) != 7 
  then
    perform error$.raise ('permission_denied');
  end if;
  
  begin
    delete 
      from cf$.Account a
     where a.Id_Project = vAccount.Id_Project
       and a.Id_Account = vAccount.Id_Account;
  exception
    when foreign_key_violation 
    then
      declare
        vConstraint_Name text;
      begin    
        get stacked diagnostics vConstraint_Name = CONSTRAINT_NAME;
        perform error$.raise ('foreign_key_violation.' || vConstraint_Name, idb_message := SQLERRM);
      end;
  end;
end;
$function$
