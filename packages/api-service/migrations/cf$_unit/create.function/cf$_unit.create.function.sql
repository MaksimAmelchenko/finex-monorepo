CREATE OR REPLACE FUNCTION "cf$_unit"."create"(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vUnit cf$.v_Unit%rowtype;
begin
  vUnit.Name := sanitize$.to_String (iParams->>'name');

  if vUnit.Name is null then
    perform error$.raise ('invalid_parameters', iDev_Message := '"name" is required');
  end if;

  begin
    insert into cf$.Unit
                (name)
         values (vUnit.name)
      returning Id_Unit
           into vUnit.Id_Unit;
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
