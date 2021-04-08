CREATE OR REPLACE FUNCTION "cf$_tag"."create"(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vTag cf$.v_Tag%rowtype;
begin
  vTag.Name := sanitize$.to_String (iParams->>'name');

  if vTag.Name is null then
    perform error$.raise ('invalid_parameters', iDev_Message := '"name" is required');
  end if;

  begin
    insert into cf$.Tag
                (name)
         values (vTag.name)
      returning Id_Tag
           into vTag.Id_Tag;
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
