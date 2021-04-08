CREATE OR REPLACE FUNCTION "cf$_tag".update(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vTag cf$.v_Tag%rowtype;
begin

  begin
    vTag.Id_Tag := (iParams->>'idTag')::int;
  exception
    when others then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idTag" must be a number');
  end;

  if vTag.Id_Tag is null then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idTag" is required');
  end if;
 
  begin
    select t.*
      into strict vTag
      from cf$.v_Tag t
     where t.Id_Tag = vTag.Id_Tag;
  exception
    when no_data_found then
      perform error$.raise ('no_data_found');
  end;

  if (iParams \? 'name') then
    vTag.Name := sanitize$.to_String (iParams->>'name');

    if vTag.Name is null then
      perform error$.raise ('invalid_parameters', iDev_Message := '"name" is empty');
    end if;
  end if;

  begin
    update cf$.Tag t
       set name = vTag.name
     where t.Id_Project = vTag.Id_Project
       and t.Id_Tag = vTag.Id_Tag;
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
  
  oResult := cf$_tag.get (('{"idTag": ' || vTag.Id_Tag::text || '}')::jsonb);
end;
$function$
