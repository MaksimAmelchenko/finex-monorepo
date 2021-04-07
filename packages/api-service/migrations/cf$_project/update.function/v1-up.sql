CREATE OR REPLACE FUNCTION "cf$_project".update(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vProject  cf$.v_Project%rowtype;
  vWriters  jsonb;
begin

  begin
    vProject.Id_Project := (iParams->>'idProject')::int;
  exception
    when others then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idProject" must be a number');
  end;

  if vProject.Id_Project is null then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idProject" is required');
  end if;
 
  begin
    select p.*
      into strict vProject
      from cf$.v_Project p
     where p.Id_Project = vProject.Id_Project;
  exception
    when no_data_found then
      perform error$.raise ('no_data_found');
  end;

  if cf$_project.get_Permit (vProject.Id_Project) != 7 then
      perform error$.raise ('permission_denied');
  end if;
  
  if (iParams \? 'name') then
    vProject.Name := sanitize$.to_String(iParams->>'name');
    if vProject.Name is null then
      perform error$.raise ('invalid_parameters', iDev_Message := '"name" is empty');
    end if;
  end if;

--  if (iParams \? 'currencies') then
--    begin
--       select array (select jsonb_array_elements_text(iParams->'currencies'))
--         into vProject.currencies;
--    exception
--      when others then
--        perform error$.raise ('invalid_parameters', iDev_Message := '"currencies" must be an array');
--    end;
--    if vProject.currencies = '{}' then
--      perform error$.raise ('invalid_parameters', iDev_Message := '"currencies" must not be empty array');
--    end if;
--  end if;

  if (iParams \? 'note') then
    vProject.Note := sanitize$.to_String(iParams->>'note');
  end if;

  begin
    update cf$.Project a
       set name = vProject.name,
           note = vProject.Note
     where a.Id_Project = vProject.Id_Project;
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

  if (iParams \? 'writers') then
    declare
      vLength int;
    begin
      vWriters := iParams->'writers';
      vLength := jsonb_array_length(vWriters);
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"writers" must be an array');
    end;

    delete 
      from cf$.Project_Permit pp 
     where pp.Id_Project = vProject.Id_Project 
       and pp.Permit = 3
       and pp.Id_User not in (select jsonb_array_elements_text(vWriters)::text::int);

    insert into cf$.Project_Permit (Id_Project, Id_User, Permit)
        (select vProject.Id_Project, value::text::int, 3
           from jsonb_array_elements_text(vWriters) 
          where value::text::int != context.get('Id_User')::int
          except all
          select pp.Id_Project, pp.Id_User, pp.Permit
            from cf$.Project_Permit pp 
           where pp.Id_Project = vProject.Id_Project 
             and pp.Permit = 3);
  end if;

  oResult := cf$_project.get (('{"idProject": ' || vProject.Id_Project::text || '}')::jsonb);
end;
$function$
