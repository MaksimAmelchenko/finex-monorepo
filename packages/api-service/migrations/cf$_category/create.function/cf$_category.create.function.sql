CREATE OR REPLACE FUNCTION "cf$_category"."create"(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vCategory  cf$.v_Category%rowtype;
begin
  if (iParams \? 'name') then
    vCategory.Name := sanitize$.to_String (iParams->>'name');
  end if;
  
  if vCategory.Name is null then 
    perform error$.raise ('invalid_parameters', iDev_Message := '"name" is required');
  end if;

  if (iParams \? 'isEnabled') then
    begin
  	  vCategory.Is_Enabled := (iParams->>'isEnabled')::boolean;
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"isEnabled" must be true or false');
    end;
  end if;
  if vCategory.Is_Enabled is null then
    perform error$.raise ('invalid_parameters', iDev_Message := '"isEnabled" is required');
  end if;

  if (iParams \? 'parent') then
    begin
      vCategory.Parent = (iParams->>'parent')::int;
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"parent" must be a number');
    end;
  end if;

  if (iParams \? 'idCaregoryPrototype') then
    begin
	    vCategory.Id_Category_Prototype = (iParams->>'idCategoryPrototype')::int;
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idCategoryPrototype" must be a number');
    end;
  end if;

  if (iParams \? 'note') then
    vCategory.Note = sanitize$.to_String(iParams->>'note');
  end if;

  -----
  
  begin
    insert into cf$.Category
                (name, Is_Enabled, parent, Id_Category_Prototype, note)
         values (vCategory.name, 
                 vCategory.Is_Enabled, 
                 vCategory.parent, 
                 vCategory.Id_Category_Prototype, 
                 vCategory.Note)
      returning Id_Category
           into vCategory.Id_Category;
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

  oResult := cf$_category.get (('{"idCategory": ' || vCategory.Id_Category::text || '}')::jsonb);
end;
$function$
