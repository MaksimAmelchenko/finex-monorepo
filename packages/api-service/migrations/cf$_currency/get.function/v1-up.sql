CREATE OR REPLACE FUNCTION "cf$_currency".get(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vResult      json;
  vId_Currency int;
begin
  with c as (select ci.Id_Currency as "idCurrency",
                    ci.Name,
                    ci.Short_Name as "shortName",
                    ci.Symbol,
                    ci.Code
               from cf$.currency ci)
  select json_agg(c)
    into vResult
    from c;

  if vId_Currency is null then
    oResult := concat ('"currencies"', ':', coalesce(vResult::text,'[]'));
  else
    oResult := concat ('"currency"', ':', coalesce (vResult->>0, '{}'));
  end if;
end;
$function$
