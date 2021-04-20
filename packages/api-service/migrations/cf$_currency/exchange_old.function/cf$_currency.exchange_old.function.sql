CREATE OR REPLACE FUNCTION "cf$_currency".exchange_old(isum numeric, iid_currency_from integer, iid_currency_to integer, idrate date, iis_round boolean DEFAULT true)
 RETURNS numeric
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
declare
  vResult numeric;
begin
  if iId_Currency_From = iId_Currency_To then
    return iSum;
  end if;
  
  if iId_Currency_From = 840 then
    vResult := iSum * cf$_currency.get_rate_old(iId_Currency_To, iDRate);
  elsif iId_Currency_To = 840 then
    vResult := iSum / cf$_currency.get_rate_old(iId_Currency_From, iDRate);
  else
    -- Конвертация через $
    vResult := cf$_currency.exchange_old(cf$_currency.exchange_old (iSum, iId_Currency_From, 840, iDRate, false), 840, iId_Currency_To, iDRate, false);
  end if;

  if iIs_Round then
    vResult := round(vResult, 2);
  end if;
  
  return vResult;
end;
$function$
