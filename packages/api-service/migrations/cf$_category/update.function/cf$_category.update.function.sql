CREATE OR REPLACE FUNCTION "cf$_category".update(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vCategory  cf$.v_Category%rowtype;
begin
  begin
    vCategory.Id_Category := (iParams->>'idCategory')::int;
  exception
    when others then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idCategory" must be a number');
  end;

  if vCategory.Id_Category is null then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idCategory" is required');
  end if;
 
  begin
    select c.*
      into strict vCategory
      from cf$.v_Category c
     where c.Id_Category = vCategory.Id_Category;
  exception
    when no_data_found then
      perform error$.raise ('no_data_found');
  end;
  
  -- Служебные категории править нельзя
  if vCategory.Is_System then
    perform error$.raise ('permission_denied');
  end if;
  
  if (iParams \? 'name') then
    vCategory.Name := sanitize$.to_String(iParams->>'name');
    if vCategory.Name is null then
      perform error$.raise ('invalid_parameters', iDev_Message := '"name" is empty');
    end if;
  end if;

  if (iParams \? 'isEnabled') then
    begin
      vCategory.Is_Enabled = (iParams->>'isEnabled')::boolean;
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"isEnabled" must be true or false');
    end;
    if vCategory.Is_Enabled is null then
      perform error$.raise ('invalid_parameters', iDev_Message := '"isEnabled" is empty');
    end if;
  end if;

  if iParams \? 'parent' then
    begin
      vCategory.parent := (iParams->>'parent')::int;
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"parent" must be a number');
    end;

    -- проверка на зациклевание
    declare
      vCount int;
    begin
      with recursive 
        ct (Id_Category, Parent) as (select c.Id_Category, c.Parent
                                       from cf$.v_Category c  
                                      where c.Id_Category = vCategory.Id_Category
                                      union all
                                     select c.Id_Category, c.Parent
                                       from ct, cf$.v_Category c
                                      where c.Parent = ct.Id_Category)
      select count(*)
        into vCount
        from ct
       where ct.Id_Category = vCategory.parent;

      if vCount != 0 then
        perform error$.raise ('invalid_parameters', iDev_Message := 'There is a cycle in the hierarchy');
      end if;
    end;
  end if;

  if iParams \? 'idCategoryPrototype' then
    begin
      vCategory.Id_Category_Prototype := (iParams->>'idCategoryPrototype')::int;
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idCategoryPrototype" must be a number');
    end;
  end if;

  if (iParams \? 'note') then
    vCategory.Note = sanitize$.to_String(iParams->>'note');
  end if;
    
  begin
    update cf$.Category c
       set name = vCategory.name,
           Is_Enabled = vCategory.is_enabled,
           parent = vCategory.parent,
           Id_Category_Prototype = vCategory.Id_Category_Prototype,
           note = vCategory.note
     where c.Id_Project = vCategory.Id_Project
       and c.Id_Category = vCategory.Id_Category;
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
