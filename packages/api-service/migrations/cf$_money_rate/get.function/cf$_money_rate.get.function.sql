CREATE OR REPLACE FUNCTION "cf$_money_rate".get(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  r          record;

  vId_Money  cf$.Money.Id_money%type;

  vResult    text;

  vLimit     integer;
  vOffset    integer;
  
  vLimit_Default  int := 50;
  vOffset_Default int := 0;

  
  vRN    int;
  vTotal int;
begin
  begin
    vId_Money := (iParams->>'idMoney')::int;
    vLimit := coalesce((iParams->>'limit')::int, vLimit_Default);
    vOffset := coalesce((iParams->>'offset')::int, vOffset_Default);
  exception
    when others
    then
      perform error$.raise ('invalid_parameters');
  end;

  if vLimit < 0 and vLimit > 100 then
    vLimit := vLimit_Default;
  end if;
  
  if vOffset < 0 then
    vOffset := vOffset_Default;
  end if;
  
  vTotal := 0;
  vRN := 0;
  for r in (select mr.Id_Money_Rate,
                   mr.Id_Money,
                   mr.DRate,
                   mr.Id_Currency,
                   mr.Rate,
                   count(*) over () as Total
              from cf$.v_Money_Rate mr
             where mr.Id_Money = vId_Money
             order by DRate desc)
		     -- Нужно ВСЕГДА получать правильное количество записей, если даже их нет в заданном диапозоне offset и limit
		     -- limit vLimit offset vOffset
  loop
    vTotal := r.Total;
    vRN := vRN + 1;
    exit when vRN > vOffset + vLimit or vOffset >= vTotal;
    continue when vRN <= vOffset;

    vResult := concat_ws (',', vResult,
                          json_build_object ('idMoneyRate', r.Id_Money_Rate,
                                             'idMoney', r.Id_Money,
                                             'dRate', r.DRate,
                                             'reportPeriod', r.Report_Period,
                                             'idCurrency', r.Id_Currency,
                                             'rate', r.Rate
                                            ));
  end loop;

  oResult := json.list ( array ['moneyRates', concat ('[', vResult , ']'), 
                                'metadata', json_build_object ('total', vTotal,
                                                               'limit', vLimit,
                                                               'offset', vOffset
                                                               )::text
                                ]);

end;
$function$
