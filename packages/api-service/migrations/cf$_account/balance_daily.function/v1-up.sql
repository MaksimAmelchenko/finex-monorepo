CREATE OR REPLACE FUNCTION "cf$_account".balance_daily(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vResult text;
  vDBegin date;
  vDEnd   date;
  vId_Money integer;
  
  r record;
begin
  begin
    vDBegin := sanitize$.to_date(iParams->>'dBegin');
  exception
    when others 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"dBegin" must be a date');
  end;

  if vDBegin is null 
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"dBegin" is required');
  end if;

  begin
    vDEnd := sanitize$.to_date(iParams->>'dEnd');
  exception
    when others 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"dEnd" must be a date');
  end;

  if vDEnd is null 
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"dEnd" is required');
  end if;

  if vDBegin > vDEnd
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"dBegin" must be less than "dEnd"');
  end if;


  if (iParams \? 'idMoney') 
  then
    begin
      vId_Money := (nullif(iParams->>'idMoney', ''))::int;
    exception
      when others 
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idMoney" must be a number');
    end;
  end if;

  with ab as (select ab.Id_Money,
                     ab.Id_Account,
                     ab.DBalance,
                     ab.Sum_In,
                     ab.Sum_Out
                from cf$_Account.account_balance_w_p(vDEnd) ab 
                     join cf$.v_Money m using (Id_Money)
               where m.Is_Enabled
             ),
       acr as (
               -- все дни 
               select ab.Id_Money,
                      ab.Id_Account,
                      generate_series (greatest(min (ab.DBalance), vDBegin)::timestamp, vDEnd::timestamp, '1 days')::date as DBalance
                 from ab
                group by ab.Id_Account,
                         ab.Id_Money
              ),
        -- Расширяем начальными, конечными и промежуточными точками
        abe as (select ab.Id_Money,
                       ab.Id_Account,
                       ab.DBalance,
                       ab.Sum_In,
                       ab.Sum_Out
                  from ab
                 union all
                select acr.Id_Money,
                       acr.Id_Account,
                       acr.DBalance,
                       0 as Sum_In,
                       0 as Sum_Out
                  from acr
                 where (acr.Id_Money, acr.Id_Account, acr.DBalance) not in (select ab.Id_Money,
                                                                                      ab.Id_Account,
                                                                                      ab.DBalance
                                                                                 from ab)
                 ),
        -- Остатки в текущих валютах
        b as (select abe.Id_Account,
                     abe.Id_Money,
                     abe.DBalance,
--                     abe.Sum_In,
--                     abe.Sum_Out,
                     sum(abe.sum_in - abe.sum_out) over (partition by abe.Id_Money, abe.Id_Account order by abe.DBalance) as Sum
                from abe
             ),
        o as (select b.Id_Money,
                     b.Id_Account,
                     b.DBalance,
                     b.Sum
                from b   
               where vId_Money is null
                 and b.DBalance >= vDBegin
               union all
              select vId_Money as Id_Money,
                     b.Id_Account,
                     b.DBalance,
--                      sum(cf$_Money.exchange(b.Sum_In, b.Id_Money, vId_Money, b.DBalance)) as Sum_In,
--                      sum(cf$_Money.exchange(b.Sum_Out, b.Id_Money, vId_Money, b.DBalance)) as Sum_Out,
                     sum(cf$_Money.exchange(b.Sum, b.Id_Money, vId_Money, b.DBalance)) as Sum
                from b
               where vId_Money is not null
                 and b.DBalance >= vDBegin
               group by b.Id_Account,
                        b.DBalance                
              ),
        -- добавляем итоговый график для всех счетов для каждой валюте
        ot as (select o.Id_Money,
                      o.Id_Account,
                      o.DBalance,
--                      o.Sum_In,
--                      o.Sum_Out,
                      o.Sum
                 from o  
                union all
               select o.Id_Money,
                      0 as Id_Account,
                      o.DBalance,
--                      sum(o.Sum_In) as Sum_In,
--                      sum(o.Sum_Out) as Sum_Out,
                      sum(o.Sum) as Sum
                 from o
                group by o.Id_Money,
                         o.DBalance                
              ),
        ofl as (select Id_Account,
                       Id_Money,
                       DBalance,
                       Sum,
                       lag (Sum) over (partition by Id_Money, Id_Account order by DBalance) prev_Sum,
                       lead (Sum) over (partition by Id_Money, Id_Account order by DBalance) next_Sum
                  from ot
                 ),
        -- удаляем избыточную информацию
        oflt as (select ofl.Id_Account,
                        ofl.Id_Money,
                        ofl.DBalance,
                        ofl.Sum
                   from ofl
                  where ofl.next_sum is null 
                     or ofl.prev_Sum is null 
                     or ofl.next_Sum != ofl.sum
                     or ofl.prev_sum != ofl.sum
                 ),
        og as (select oflt.Id_Money as "idMoney",
                      oflt.Id_Account as "idAccount",
                      oflt.DBalance as "dBalance",
--                      ot.Sum_In as  "sumIn",
--                      ot.Sum_Out as "sumOut",
                      oflt.Sum as "sum"
                 from oflt
              )
    select json_agg(og order by og."idMoney", og."idAccount", og."dBalance")
      into vResult
      from og;

  oResult := concat ('"balances"', ':', coalesce(vResult::text, '[]'));
end;
$function$
