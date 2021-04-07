CREATE OR REPLACE FUNCTION "cf$_category_prototype".get(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vResult                json;
  vId_Category_Prototype int;
begin
  begin
    vId_Category_Prototype := (iParams->>'idCategoryPrototype')::int;
  exception
    when others then
      perform error$.raise ('invalid_parameters');
  end;

  with 
    cp as (select cp.Id_Category_Prototype as "idCategoryPrototype",
                  cp.Parent,
                  cp.Name
             from cf$.Category_Prototype cp
            where cp.Id_Category_Prototype = coalesce(vId_Category_Prototype, cp.Id_Category_Prototype)
              and not cp.Is_System)
  select json_agg(cp)
    into vResult
    from cp;

  if vId_Category_Prototype is null then
    oResult := concat ('"categoryPrototypes"', ':', coalesce(vResult::text,'[]'));
  else
    oResult := concat ('"categoryPrototype"', ':', coalesce (vResult->>0, '{}'));
  end if;

end;
$function$
