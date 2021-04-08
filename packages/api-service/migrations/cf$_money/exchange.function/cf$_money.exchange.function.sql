CREATE OR REPLACE FUNCTION "cf$_money".exchange(isum numeric, iid_money_from integer, iid_money_to integer, idrate date, iis_round boolean DEFAULT true)
 RETURNS numeric
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
declare
  vResult numeric;
  vId_Currency_Rate_Source smallint := context.get('Id_Currency_Rate_Source')::smallint;
  vId_Currency_To   cf$.Currency.Id_Currency%type;
  vId_Currency_From cf$.Currency.Id_Currency%type;
begin
  if iId_Money_From = iId_Money_To then
    return iSum;
  end if;
  
  begin
    select m.Id_Currency
      into strict vId_Currency_To
      from cf$.v_Money m
     where m.Id_Money = iId_Money_to;
  exception
    when no_data_found then
      perform error$.raise ('no_data_found');
  end;

  begin
    select m.Id_Currency
      into strict vId_Currency_From
      from cf$.v_Money m
     where m.Id_Money = iId_Money_From;
  exception
    when no_data_found then
      perform error$.raise ('no_data_found');
  end;
  
  if vId_Currency_From is null or vId_Currency_To is null then
--    perform error$.raise ('internal_server_error', iMessage := 'Пока еще не реализован обмен валюты без указаной базовой валюты');
    return 0;
  end if;
  
  -- http://openexchangerates.org/
  if vId_Currency_Rate_Source = 1 then
    -- Базовая валюта - доллар
    if vId_Currency_From = 840 then
      vResult := iSum * cf$_currency.get_rate(vId_Currency_To, iDRate, vId_Currency_Rate_Source);
    elsif vId_Currency_To = 840 then
      vResult := iSum / cf$_currency.get_rate(vId_Currency_From, iDRate, vId_Currency_Rate_Source);
    else
      -- Конвертация через $
      vResult := cf$_currency.exchange(cf$_currency.exchange (iSum, vId_Currency_From, 840, iDRate, false), 840, vId_Currency_To, iDRate, false);
    end if;
  -- http://www.cbr.ru/
  elsif vId_Currency_Rate_Source = 2 then
    -- Базовая валюта - Российский рубль
    if vId_Currency_From = 643 then
      vResult := iSum * cf$_currency.get_rate(vId_Currency_To, iDRate, vId_Currency_Rate_Source);
    elsif vId_Currency_To = 643 then
      vResult := iSum / cf$_currency.get_rate(vId_Currency_From, iDRate, vId_Currency_Rate_Source);
    else
      -- Конвертация через руб
      vResult := cf$_currency.exchange(cf$_currency.exchange (iSum, vId_Currency_From, 643, iDRate, false), 643, vId_Currency_To, iDRate, false);
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
