CREATE OR REPLACE FUNCTION "cf$_category".move(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vId_Category_From cf$.Category.Id_Category%type;
  vId_Category_To   cf$.Category.Id_Category%type;
  vIs_Recursive     boolean;
  vCount            int;
  vId_Project       int := context.get('Id_Project')::int;
begin
  begin
    vId_Category_From := (iParams->>'idCategory')::int;
  exception
    when others then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idCategory" must be a number');
  end;

  if vId_Category_From is null then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idCategory" is required');
  end if;

  begin
    vId_Category_To := (iParams->>'idCategoryTo')::int;
  exception
    when others then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idCategoryTo" must be a number');
  end;

  if vId_Category_To is null then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idCategoryTo" is required');
  end if;

  begin
    vIs_Recursive = coalesce((iParams->>'isRecursive')::boolean, false);
  exception
    when others then
      perform error$.raise ('invalid_parameters', iDev_Message := '"isRecursive" must be true or false');
  end;
 
  begin
    select c.Id_Category
      into strict vId_Category_From
      from cf$.v_Category c
     where c.Id_Category = vId_Category_From;
  exception
    when no_data_found then
      perform error$.raise ('no_data_found');
  end;

  begin
    select c.Id_Category
      into strict vId_Category_To
      from cf$.v_Category c
     where c.Id_Category = vId_Category_To;
  exception
    when no_data_found then
      perform error$.raise ('no_data_found');
  end;
  
  if not vIs_Recursive and vId_Category_To = vId_Category_From then
    perform error$.raise ('invalid_parameters', iDev_Message := 'Cannot move a category to the same category without recursion');
  end if;
  

  with recursive 
    ct (Id_Category, Parent) as (select c.Id_Category, c.Parent
                                   from cf$.v_Category c  
                                  where c.Id_Category = vId_Category_From
                                  union all
                                 select c.Id_Category, c.Parent
                                   from ct, cf$.v_Category c
                                  where c.Parent = ct.Id_Category
                                    and vIs_Recursive = true),
    u as (
       update cf$.CashFlow_Detail cfd
          set Id_Category = vId_Category_To
        where cfd.Id_Project = vId_Project
          and cfd.Id_Category in (select ct.Id_Category
                                    from ct)
          and exists (select 1 
                        from cf$.v_CashFlow_Detail cfdi
                       where cfdi.Id_Project = cfd.Id_Project
                         and cfdi.Id_CashFlow_Detail = cfd.Id_cashFlow_Detail
                         and cfdi.Permit & 3 = 3
                       limit 1)
    returning *)
      select count(*) 
        into vCount
        from u;
     
  oResult := concat('"count"', ':', json.to_json(vCount));
end;
$function$
