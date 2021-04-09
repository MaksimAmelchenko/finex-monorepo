CREATE OR REPLACE FUNCTION "cf$_debt"."#get"(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  r          record;

  vId_Debt     cf$.v_CashFlow.Id_CashFlow%type;
  vId_Debt_Cur cf$.v_CashFlow.Id_CashFlow%type;

  vResult    text;
  vDebtDetail  text;
  vDebt        text[];

  vLimit     integer;
  vOffset    integer;
  
  vLimit_Default int := 10;
  vOffset_Default int := 0;

  vFilter json;
  vTotal  int;
begin

  begin
    vId_Debt := (iParams->>'idDebt')::int;
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
  
  vId_Debt_Cur := -1;
  vTotal := 0;
  for r in (select a.*,
                   max (rank) over () as Total
              from (select dense_rank() over ( order by coalesce (cfd.DLast,  cf.DSet)  desc, cf.Id_Cashflow desc) as rank,
                           --
                           cf.Id_CashFlow,
                           cf.DSet,
                           cf.Id_Counteragent,
                           cf.Note as CashFlow_Note,
                           cf.Id_User as CashFlow_Id_User,
                           --
                           cfd.Id_CashFlow_Detail,
                           cfd.Id_User,
                           cfd.Id_Account,
                           cfd.Id_CashFlow_Item,
                           cfd.Id_Currency,
                           cfd.Id_Unit,
                           cfd.DCashFlow_Detail,
                           cfd.Report_Period,
                           cfd.Sign,
                           cfd.Quantity,
                           cfd.Summa,
                           cfd.Note,
                           null::text as tags
                      from cf$.CashFlow cf
                           left join  (select cfdi.*,
                                              max (cfdi.DCashFlow_Detail) over (partition by cfdi.Id_CashFlow ) as DLast
                                         from cf$.v_CashFlow_Detail cfdi) cfd
                             on (cfd.Id_CashFlow = cf.Id_CashFlow)
                     where (   (    cfd.Id_CashFlow_Detail is null
                                and cf.Id_User = context.get('Id_User')::int)
                            or cfd.Id_CashFlow_Detail is not null)
                       and cf.Id_CashFlow_Type = 2
                       and cf.Id_Project = context.get('Id_Project')::int
                       and cf.Id_CashFlow = coalesce(vId_Debt, cf.Id_CashFlow)
                     order by coalesce (cfd.DLast,  cf.DSet)  desc, cf.Id_Cashflow desc) a)
  loop
    vTotal = r.Total;
    exit when r.Rank > vOffset + vLimit or vOffset >= vTotal;
    continue when r.Rank <= vOffset;    
    
    if r.Id_CashFlow != vId_Debt_Cur then
      vId_Debt_Cur := r.Id_CashFlow;

      if vDebt != '{}' then
        vResult := concat_ws (',', vResult,
                              json.object (vDebt || array ['debtDetails', concat('[', vDebtDetail, ']')]));
        vDebtDetail := null;                                
      end if;                                

      vDebt := array ['idUser', json.to_json(r.CashFlow_Id_User),
                    'idDebt', json.to_json(r.Id_CashFlow),
                    'dSet', json.to_json(r.DSet),
                    'idCounteragent', json.to_json(r.Id_Counteragent),
                    'note', json.to_json(r.CashFlow_Note)                    
                    ];
    end if;  

    if r.Id_CashFlow_Detail is not null then
      vDebtDetail := concat_ws (',', vDebtDetail,
                            json_build_object ('idUser', r.Id_User,
                                               'idDebtDetail', r.Id_CashFlow_Detail,
                                               'idAccount', r.Id_Account,
                                               'idDebtItem', r.Id_CashFlow_Item,
                                               'idCurrency', r.Id_Currency,
                                               'sign', r.Sign,
                                               'dDebtDetail', json.format (r.DCashFlow_Detail),
                                               'reportPeriod', json.format (r.Report_Period),
                                               'summa', r.Summa,
                                               'note', r.Note,
                                               'tags', r.tags
                                                ));
    end if;                                                
  end loop;

  if vDebt != '{}' then
    vResult := concat_ws (',', vResult,
                          json.object (vDebt || array ['debtDetails', concat('[', vDebtDetail, ']')]));
  end if;                                


  if vId_Debt is  null then
    oResult := json.list ( array ['debts', concat ('[', vResult , ']'), 
                                  'metadata', json_build_object ('total', vTotal,
                                                                 'limit', vLimit,
                                                                 'offset', vOffset
                                                                 )::text
                                 ]);
  else
    oResult := concat('"debt"', ':', coalesce(vResult, '{}'));
--	perform pg_sleep(2);
  end if;
end;
$function$
