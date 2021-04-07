CREATE OR REPLACE FUNCTION "cf$_project".destroy(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vId_Project cf$.Project.Id_Project%type;
begin
  begin
    vId_Project := (iParams->>'idProject')::int;
  exception
    when others then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idProject" must be a number');
  end;
  
  if vId_Project is null then
	  perform error$.raise ('invalid_parameters', iDev_Message := '"idProject" is required');
  end if;
  
  begin
    select a.Id_Project
      into strict vId_Project
      from cf$.v_Project a
     where a.Id_Project = vId_Project;
  exception
    when no_data_found then
      perform error$.raise ('no_data_found');
  end;

  if vId_Project = context.get('Id_Project')::int then
    perform error$.raise ('invalid_parameters', iDev_Message := 'Cannot delete current project');
  end if;
  
  if cf$_project.get_Permit (vId_Project) != 7 then
    perform error$.raise ('permission_denied');
  end if;
  
  -- TODO 
  -- придумать, что делать с общими проектами со счетами, 
  -- к которым у текущего пользователя нет доступа
  -- Проект может удалить владелец. Счета, которые он не может читать тоже удаляются.
  
  declare
    vId_User    core$.User.Id_User%type;
  begin
    perform context.set('isNotCheckPermit', 'true');
    
    vId_User := context.get('Id_User')::int;
    update core$.User u 
       set Id_Project = null
     where u.Id_User = vId_User
       and u.Id_Project = vId_Project;

    delete 
      from cf$.Project p
     where p.Id_Project = vId_Project;

    perform context.set('isNotCheckPermit', '');
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
