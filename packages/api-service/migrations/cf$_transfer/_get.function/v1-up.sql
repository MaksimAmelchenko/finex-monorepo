CREATE OR REPLACE FUNCTION "cf$_transfer"."#get"(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  r          record;

  vId_Transfer cf$.v_CashFlow.Id_CashFlow%type;

  vResult    text;

  vLimit     integer;
  vOffset    integer;
  
  vLimit_Default int := 10;
  vOffset_Default int := 0;

  vFilter jsonb;
  vTotal int;
begin

  begin
    vId_Transfer := (iParams->>'idTransfer')::int;
    vLimit := coalesce((iParams->>'limit')::int, vLimit_Default);
    vOffset := coalesce((iParams->>'offset')::int, vOffset_Default);
    vFilter := iParams->'filter';
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
  for r in (select Id_User,
                   Id_CashFlow, 
                   DCashFlow,
                   Report_Period, 
                   Note, 
                   max (Id_Account_From) as Id_Account_From,
                   max (Summa) as Summa,
                   max (Id_Currency) as Id_Currency,
                   max (Id_Account_To) as Id_Account_To,
                   max (Id_Account_Fee) as Id_Account_Fee,
                   max (Fee) as Fee,
                   max (Id_Currency_Fee) as Id_Currency_Fee,
                   row_number() over(order by DCashFlow desc, Id_Cashflow desc) as rn,
                   count(*) over () as Total
              from (select cf.Id_CashFlow,
                           cf.Note,
                           cf.Id_User,
                           --
                           cfd.Report_Period,
                           cfd.DCashFlow_Detail as DCashFlow,
                           --
                           case when Id_CashFlow_Item = 11 and cfd.sign = -1 then cfd.Id_Account end as Id_Account_From,
                           case when Id_CashFlow_Item = 11 and cfd.sign = -1 then cfd.Summa end as Summa,
                           case when Id_CashFlow_Item = 11 and cfd.sign = -1 then cfd.Id_Currency end as Id_Currency,
                           --
                           case when Id_CashFlow_Item = 11 and cfd.sign = 1 then cfd.Id_Account end as Id_Account_To,
                           --
                           case when Id_CashFlow_Item = 12 and cfd.sign = -1 then cfd.Id_Account end as Id_Account_Fee,
                           case when Id_CashFlow_Item = 12 and cfd.sign = -1 then cfd.Summa end as Fee,
                           case when Id_CashFlow_Item = 12 and cfd.sign = -1 then cfd.Id_Currency end as Id_Currency_Fee
                      from cf$_household.member() m
                           join cf$.CashFlow cf
                             on cf.Id_User = m.Id_User
                           join (select cfdi.*,
                                        max (cfdi.DCashFlow_Detail) over (partition by cfdi.Id_CashFlow ) as DLast,
                                        count (*) over (partition by cfdi.Id_CashFlow ) as cnt
                                   from cf$.v_CashFlow_Detail cfdi) cfd
                             on (cfd.Id_CashFlow = cf.Id_CashFlow)
                           join (select Id_CashFlow, 
                                        count (*) over (partition by cfdi2.Id_CashFlow ) as cnt
                                   from cf$_household.member() m
                                        join cf$.CashFlow_Detail cfdi2
                                          on (    cfdi2.Id_Project = context.get('Id_Project')::int 
                                              and cfdi2.Id_User = m.Id_User)) cfd2
                             on (cfd2.Id_CashFlow = cf.Id_CashFlow)
                     where cfd.cnt = cfd2.cnt     -- Смотрим, что бы на все ДДП были права на чтения (общее количество ДДП = количество ДДП с правом чтения) 
                       and cf.Id_CashFlow_Type = 3 --  transfers
                       and cf.Id_Project = context.get('Id_Project')::int
                       and cf.Id_CashFlow = coalesce(vId_Transfer, cf.Id_CashFlow)) a
          group by Id_CashFlow, Note, Id_User, Report_Period, DCashFlow
          order by DCashFlow desc, Id_Cashflow desc
--             limit vLimit offset vOffset
)
  loop
    vTotal = r.Total;
    exit when r.rn > vOffset + vLimit or vOffset >= vTotal;
    continue when r.rn <= vOffset;

    vResult := concat_ws (',', vResult,
                          json.object ( array ['idUser', json.to_json(r.Id_User),
                                               'idTransfer', json.to_json(r.Id_CashFlow),
                                               'dTransfer', json.to_json(r.DCashFlow),
                                               'reportPeriod', json.to_json(r.Report_Period),
                                               'note', json.to_json(r.Note),
                                               'idAccountFrom', json.to_json(r.Id_Account_From),
                                               'summa', json.to_json(r.Summa),
                                               'idCurrency', json.to_json(r.Id_Currency),
                                               'idAccountTo', json.to_json(r.Id_Account_To),
                                               'isFee', json.to_json(r.Id_Account_Fee is not null),
                                               'idAccountFee', json.to_json(r.Id_Account_Fee),
                                               'fee', json.to_json(r.Fee),
                                               'idCurrencyFee', json.to_json(r.Id_Currency_Fee)
                                              ]));
  end loop;

  if vId_Transfer is  null then
    oResult := json.list ( array ['transfers', concat ('[', vResult , ']'), 
                                  'metadata', json.object ( array ['total', json.to_json(vTotal),
                                                                   'limit', json.to_json(vLimit),
                                                                   'offset', json.to_json(vOffset)
                                                                   ])
                                 ]);
  else
    oResult := concat('"transfer"', ':', coalesce (vResult, '{}'));
  end if;

--	perform pg_sleep(2);
end;
$function$
