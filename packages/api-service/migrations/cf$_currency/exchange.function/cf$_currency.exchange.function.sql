CREATE OR REPLACE FUNCTION "cf$_currency".exchange(isum numeric, iid_currency_from integer, iid_currency_to integer, idrate date, iis_round boolean DEFAULT true)
 RETURNS numeric
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
declare
  vResult numeric;
  vId_Currency_Rate_Source smallint := context.get('Id_Currency_Rate_Source')::smallint;
begin
  if iId_Currency_From = iId_Currency_To then
    return iSum;
  end if;
  
  -- http://openexchangerates.org/
  if vId_Currency_Rate_Source = 1 then
    -- Базовая валюта - доллар
    if iId_Currency_From = 840 then
      vResult := iSum * cf$_currency.get_rate(iId_Currency_To, iDRate, vId_Currency_Rate_Source);
    elsif iId_Currency_To = 840 then
      vResult := iSum / cf$_currency.get_rate(iId_Currency_From, iDRate, vId_Currency_Rate_Source);
    else
      -- Конвертация через $
      vResult := cf$_currency.exchange(cf$_currency.exchange (iSum, iId_Currency_From, 840, iDRate, false), 840, iId_Currency_To, iDRate, false);
    end if;
  -- http://www.cbr.ru/
  elsif vId_Currency_Rate_Source = 2 then
    -- Базовая валюта - Российский рубль
    if iId_Currency_From = 643 then
      vResult := iSum * cf$_currency.get_rate(iId_Currency_To, iDRate, vId_Currency_Rate_Source);
    elsif iId_Currency_To = 643 then
      vResult := iSum / cf$_currency.get_rate(iId_Currency_From, iDRate, vId_Currency_Rate_Source);
    else
      -- Конвертация через $
      vResult := cf$_currency.exchange(cf$_currency.exchange (iSum, iId_Currency_From, 643, iDRate, false), 643, iId_Currency_To, iDRate, false);
    end if;
  else
    perform error$.raise('internal_server_error');
  end if;
  
  if iIs_Round then
    vResult := round(vResult, 2);
  end if;
  
  return vResult;
end;
$function$
