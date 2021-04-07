CREATE OR REPLACE FUNCTION "cf$_unit".update(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vUnit        cf$.v_Unit%rowtype;
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

  if (iParams \? 'name') then
    vUnit.Name := sanitize$.to_String (iParams->>'name');
  end if;

  begin
    update cf$.Unit u
       set name = vUnit.name
     where u.Id_Project = vUnit.Id_Project
       and u.Id_Unit = vUnit.Id_Unit;
  exception
    when unique_violation then
      declare
        vConstraint_Name text;
      begin    
        get stacked diagnostics vConstraint_Name = CONSTRAINT_NAME;
        perform error$.raise ('unique_violation.' || vConstraint_Name, idb_message := SQLERRM);
      end;
    when check_violation then
      declare
        vConstraint_Name text;
      begin    
        get stacked diagnostics vConstraint_Name = CONSTRAINT_NAME;
        perform error$.raise ('check_violation.' || vConstraint_Name, idb_message := SQLERRM);
      end;
  end;
  
  oResult := cf$_unit.get (('{"idUnit": ' || vUnit.Id_Unit::text || '}')::jsonb);
end;
$function$
