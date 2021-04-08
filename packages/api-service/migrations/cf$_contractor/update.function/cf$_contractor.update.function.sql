CREATE OR REPLACE FUNCTION "cf$_contractor".update(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vContractor  cf$.v_Contractor%rowtype;
begin
  begin
    vContractor.Id_Contractor := (iParams->>'idContractor')::int;
  exception
    when others then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idContractor" must be a number');
  end;

  if vContractor.Id_Contractor is null then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idContractor" is required');
  end if;
 
  begin
    select c.*
      into strict vContractor
      from cf$.v_Contractor c
     where c.Id_Contractor = vContractor.Id_Contractor;
  exception
    when no_data_found then
      perform error$.raise ('no_data_found');
  end;
  
  if (iParams \? 'name') then
    vContractor.Name = sanitize$.to_String (iParams->>'name');
  end if;

  if (iParams \? 'note') then
    vContractor.Note = sanitize$.to_String (iParams->>'note');
  end if;

  begin
    update cf$.Contractor c
       set name = vContractor.name,
           note = vContractor.note
     where c.Id_Project = vContractor.Id_Project
       and c.Id_Contractor = vContractor.Id_Contractor;
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
