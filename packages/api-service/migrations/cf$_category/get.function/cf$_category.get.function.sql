CREATE OR REPLACE FUNCTION "cf$_category".get(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vResult      json;
  vId_Category cf$.Category.Id_Category%type;
begin
  begin
    vId_Category := (iParams->>'idCategory')::int;
  exception
    when others then
      perform error$.raise ('invalid_parameters');
  end;

  with c as (select c.Id_User as "idUser",
                    c.Id_Category as "idCategory",
                    c.Parent,
                    c.Id_Category_Prototype as "idCategoryPrototype",
                    c.Id_Unit as "idUnit",
                    c.Is_Enabled as "isEnabled",
                    c.Is_System as "isSystem",
                    c.Name, -- || ' #' || (select count(*) from cf$.v_CashFlow_Detail cfd where cfd.Id_Category = c.Id_Category) as name,
                    coalesce (c.Note, '') as Note
            from cf$.v_Category c
           where c.Id_Category = coalesce(vId_Category, c.Id_Category))
  select json_agg(c)
    into vResult
    from c;             

  if vId_Category is null then
    oResult := concat ('"categories"', ':', coalesce(vResult::text,'[]'));
  else
    oResult := concat ('"category"', ':', coalesce (vResult->>0, '{}'));
  end if;

end;
$function$
