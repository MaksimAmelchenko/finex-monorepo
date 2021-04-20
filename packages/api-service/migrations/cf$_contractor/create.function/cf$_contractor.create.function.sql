CREATE OR REPLACE FUNCTION "cf$_contractor"."create"(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vContractor        cf$.v_Contractor%rowtype;
begin
  vContractor.Name := sanitize$.to_String (iParams->>'name');

  if vContractor.Name is null then
    perform error$.raise ('invalid_parameters', iDev_Message := '"name" is required');
  end if;

  if (iParams \? 'note') then
    vContractor.Note := sanitize$.to_String (iParams->>'note');
  end if;

  begin
    insert into cf$.Contractor
                (name, Note)
         values (vContractor.name, vContractor.Note)
      returning Id_Contractor
           into vContractor.Id_Contractor;
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

  oResult := cf$_contractor.get (('{"idContractor": ' || vContractor.Id_Contractor::text || '}')::jsonb);
end;
$function$
