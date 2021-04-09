CREATE OR REPLACE FUNCTION "cf$_project"."create"(iparams jsonb, OUT oresult text)
  RETURNS text
  LANGUAGE plpgsql
  SECURITY DEFINER
AS $function$
declare
  vProject  cf$.v_Project%rowtype;
  vWriters  jsonb;
  vId_User  core$.User.Id_User%type := context.get('Id_User')::int;
begin
  if vId_User is null
  then
    vId_User := iparams->>'id_user';
    perform context.set('Id_User', vId_User::text);
  end if;

  vProject.Name := sanitize$.to_String (iParams->>'name');

  if vProject.Name is null then
    perform error$.raise ('invalid_parameters', iDev_Message := '"name" is required');
  end if;

  vProject.Note := sanitize$.to_String (iParams->>'note');

  if (iParams \? 'writers') then
    vWriters := iParams->'writers';
    if jsonb_typeof(vWriters) <> 'array' then
      perform error$.raise ('invalid_parameters', iDev_Message := '"writers" must be an array');
    end if;

    declare
      vSum int;
    begin
      select sum (value::int)
        into vSum
        from jsonb_array_elements_text(vWriters);
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"writers" must be an array of integer');
    end;
  end if;

  vProject.Id_Project := cf$_project.create (vProject.name, vProject.Note);

  begin
    insert into cf$.Project_Permit (Id_Project, Id_User, Permit)
      (select distinct vProject.Id_Project, value::int, 3
         from jsonb_array_elements_text (vWriters)
        where value::int != vId_User);
  exception
    when others then
      perform error$.raise ('no_data_found', iDev_Message := '"writers" contents unknown users''s  id', iDB_Message := SQLERRM);
  end;

  oResult := cf$_project.get (('{"idProject": ' || vProject.Id_Project::text || '}')::jsonb);
end;
$function$
