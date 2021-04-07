CREATE OR REPLACE FUNCTION "cf$_currency_rate_source".get(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vResult  json;
begin
  with a as (select crs.Id_Currency_Rate_Source as "idCurrencyRateSource",
                    crs.Name
               from cf$.Currency_Rate_Source crs)
  select json_agg(a)
    into vResult
    from a;

  oResult := concat ('"currencyRateSources"', ':', coalesce(vResult::text,'[]'));
end;
$function$
