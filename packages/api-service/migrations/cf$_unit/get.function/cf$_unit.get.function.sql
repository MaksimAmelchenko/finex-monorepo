CREATE OR REPLACE FUNCTION "cf$_unit".get(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vResult  json;
  vId_Unit int;
begin
  begin
    vId_Unit := (iParams->>'idUnit')::int;
  exception
    when others
    then
      perform error$.raise ('invalid_parameters');
  end;

  with u as (select ui.Id_User as "idUser",
                    ui.Id_Unit as "idUnit",
                    ui.Name
               from cf$.v_Unit ui
              where ui.Id_Unit = coalesce (vId_Unit, ui.Id_Unit))
  select json_agg(u)
    into vResult
    from u;

  if vId_Unit is null then
    oResult := concat ('"units"', ':', coalesce(vResult::text,'[]'));
  else
    oResult := concat ('"unit"', ':', coalesce (vResult->>0, '{}'));
  end if;
end;
$function$
