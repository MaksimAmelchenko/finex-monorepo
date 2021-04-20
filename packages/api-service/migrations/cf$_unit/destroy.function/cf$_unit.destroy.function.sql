CREATE OR REPLACE FUNCTION "cf$_unit".destroy(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vUnit cf$.v_Unit%rowtype;
begin

  begin
    vUnit.Id_Unit := (iParams->>'idUnit')::int;
  exception
    when others then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idUnit" must be a number');
  end;
  
  if vUnit.Id_Unit is null then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idUnit" is required');
  end if;

  begin
    select u.*
      into strict vUnit
      from cf$.v_Unit u
     where u.Id_Unit = vUnit.Id_Unit;
  exception
    when no_data_found then
      perform error$.raise ('no_data_found');
  end;

  begin
    delete 
      from cf$.Unit u
     where u.Id_Project = vUnit.Id_Project
       and u.Id_Unit = vUnit.Id_Unit;
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
