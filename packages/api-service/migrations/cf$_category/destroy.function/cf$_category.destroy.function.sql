CREATE OR REPLACE FUNCTION "cf$_category".destroy(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vCategory cf$.v_Category%rowtype;
begin

  begin
    vCategory.Id_Category := (iParams->>'idCategory')::int;
  exception
    when others then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idCategory" must be a number');
  end;

  if vCategory.Id_Category is null then
	  perform error$.raise ('invalid_parameters', iDev_Message := '"idCategory" is required');
  end if;

  begin
    select cfi.*
      into strict vCategory
      from cf$.v_Category cfi
     where cfi.Id_Category = vCategory.Id_Category;
  exception
    when no_data_found then
      perform error$.raise ('no_data_found');
  end;

  if vCategory.Is_System then
    perform error$.raise ('permission_denied');
  end if;
  
  begin
    delete 
      from cf$.Category cfi
     where cfi.Id_Project = vCategory.Id_Project
       and cfi.Id_Category = vCategory.Id_Category;
  exception
    when foreign_key_violation then
      declare
        vConstraint_Name text;
      begin    
        get stacked diagnostics vConstraint_Name = CONSTRAINT_NAME;
        perform error$.raise ('foreign_key_violation.' || vConstraint_Name, idb_message := SQLERRM);
      end;
  end;
end;
$function$
