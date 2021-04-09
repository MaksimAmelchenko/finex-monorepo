CREATE OR REPLACE FUNCTION "cf$_project".use(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vId_Project cf$.v_Project.Id_Project%type;
  vSessionId  core$.Session.Id%type;
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
    select p.Id_Project
      into strict vId_Project
      from cf$.v_Project p
     where p.Id_Project = vId_Project;
  exception
    when no_data_found then
      perform error$.raise ('no_data_found');
  end;

  perform context.set ('Id_Project', vId_Project::text);

  vSessionId = context.get('Id_Session')::uuid;
  update core$.session s
     set Id_Project = vId_Project
   where s.Id = vSessionId;

  oResult := cf$_project.get_Dependency ('{}'::jsonb);
end;
$function$
