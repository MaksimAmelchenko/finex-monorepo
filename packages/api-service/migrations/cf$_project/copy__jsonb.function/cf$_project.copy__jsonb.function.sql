CREATE OR REPLACE FUNCTION "cf$_project".copy(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vProject    cf$.v_Project%rowtype;
  vId_Project cf$.v_Project.Id_project%type;
  vName       cf$.v_Project.name%type;
begin
  begin
    vProject.Id_Project := iParams->>'idProject';
  exception
    when others
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idProject" must be a number');
  end;

  if vProject.Id_Project is null
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idProject" is required');
  end if;
  
  vName := sanitize$.to_String(iParams->>'name');

  if vName is null
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"name" is required');
  end if;
 
  begin
    select p.*
      into strict vProject
      from cf$.v_Project p
     where p.Id_Project = vProject.Id_Project;
  exception
    when no_data_found
    then
      perform error$.raise ('no_data_found');
  end;

  begin
    insert into cf$.Project  
                (Id_User, name, note)
         values (vProject.Id_User, vName, vProject.Note)
      returning Id_Project
           into vId_Project;
  exception
    when unique_violation
    then
      declare
        vConstraint_Name text;
      begin    
        get stacked diagnostics vConstraint_Name = CONSTRAINT_NAME;
        perform error$.raise ('unique_violation.' || vConstraint_Name, idb_message := SQLERRM);
      end;
    when check_violation
    then
      declare
        vConstraint_Name text;
      begin    
        get stacked diagnostics vConstraint_Name = CONSTRAINT_NAME;
        perform error$.raise ('check_violation.' || vConstraint_Name, idb_message := SQLERRM);
      end;
  end;
  
  insert into cf$.Project_Permit (Id_Project, Id_User, Permit)
       select vId_Project, pp.Id_User, pp.Permit
         from cf$.Project_Permit pp
        where pp.Id_Project = vProject.Id_Project;

  perform cf$_project.copy (vProject.Id_Project, vId_Project);

  oResult := cf$_project.get (('{"idProject": ' || vId_Project::text || '}')::jsonb);
end;
$function$
