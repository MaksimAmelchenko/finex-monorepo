CREATE OR REPLACE FUNCTION "cf$_plan_cashflow_item".get(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vResult  text;
  vId_Plan cf$.Plan_CashFlow_Item.Id_Plan%type;

  r       record;  
  vLimit  int;
  vOffset int;
  vTotal  int;
  vRN     int;
  
  vLimit_Default  int := 50;
  vOffset_Default int := 0;

begin
  begin
    vId_Plan := iParams->>'idPlanCashFlowItem';
    vLimit := coalesce((iParams->>'limit')::int, vLimit_Default);
    vOffset := coalesce((iParams->>'offset')::int, vOffset_Default);
  exception
    when others
    then
      perform error$.raise ('invalid_parameters');
  end;

  if vLimit not between 1 and 100 
  then
    vLimit := vLimit_Default;
  end if;
  
  if vOffset < 0 
  then
    vOffset := vOffset_Default;
  end if;

  vTotal := 0;
  vRN := 0;

  for r in (with 
              s as (select p.Id_Plan, 
                           si.DPlan, 
                           si.NRepeat,
                           row_number() over (partition by si.Id_Plan order by si.DPlan) as rn
                      from cf$.Plan p, 
                           cf$_plan.schedule(p.Id_Plan, now()::date, (p.DBegin + interval '1 year')::date) si
                   )
            select pcfi.Id_User,
                   pcfi.Id_Plan,
                   pcfi.Id_Contractor,
                   pcfi.Id_Account,
                   pcfi.Id_Category,
                   pcfi.Id_Money,
                   pcfi.Id_Unit,
                   pcfi.Sign,
                   pcfi.DBegin,
                   pcfi.Report_Period,
                   pcfi.Quantity,
                   pcfi.sum,
                   pcfi.Operation_Note,
                   pcfi.OPeration_Tags,
                   pcfi.Repeat_Type,
                   pcfi.Repeat_Days,
                   pcfi.End_Type,
                   pcfi.Repeat_Count,
                   pcfi.DEnd,
                   pcfi.Color_Mark,
                   pcfi.Note,
                   s.DPlan,
                   s.NRepeat,
                   count(*) over () as Total
/*                    array (select json_agg(e)
                            from (select json.to_json(pcfie.DBegin) as "dBegin",
                                         json.to_json(pcfie.DEnd) as "dEnd"
                                    from cf$.Plan_CashFlow_Item_Exclude pcfie 
                                   where pcfie.Id_Project = pcfi.Id_Project
                                     and pcfie.Id_Plan_CashFlow_Item = pcfi.Id_Plan_CashFlow_Item) e) as "excludePeriods"
*/            from    cf$.v_Plan_CashFlow_Item pcfi left join s
                   on (    s.Id_Plan = pcfi.Id_Plan
                       and s.rn = 1)
             where (vId_Plan is null or pcfi.Id_Plan = vId_Plan) )
  loop
    vTotal := r.Total;
    vRN := vRN + 1;
    exit when vRN > vOffset + vLimit or vOffset >= vTotal;
    continue when vRN <= vOffset;

    vResult := concat_ws (',', vResult,
                          json_build_object ('idUser', r.Id_User,
                                             'idPlanCashFlowItem', r.Id_Plan,
                                             'idContractor',  r.Id_Contractor,
                                             'idAccount', r.Id_Account,
                                             'idCategory', r.Id_Category,
                                             'sign', r.Sign,
                                             'dBegin', r.DBegin,
                                             'reportPeriod', r.Report_Period,
                                             'quantity', r.Quantity,
                                             'idUnit', r.Id_Unit,
                                             'sum', r.Sum,
                                             'idMoney', r.Id_Money,
                                             'operationNote', coalesce(r.Operation_Note, ''),
                                             'operationTags', cf$_tag.encode(r.Operation_Tags),
                                             'repeatType', r.Repeat_Type,
                                             'repeatDays', r.Repeat_Days,
                                             'endType', r.End_Type,
                                             'repeatCount', r.Repeat_Count,
                                             'dEnd', r.DEnd,
                                             'colorMark', r.Color_Mark,
                                             'note', coalesce(r.Note, ''),
                                             'dPlan', r.DPlan,
                                             'nRepeat', r.NRepeat
                                            ));
  end loop;              

  if vId_Plan is null 
  then
    oResult := json.list ( array ['planCashFlowItems', concat ('[', vResult , ']'), 
                                  'metadata', json_build_object ('total', vTotal,
                                                                 'limit', vLimit,
                                                                 'offset', vOffset
                                                                 )::text
                                  ]);
  else
    oResult := concat('"planCashFlowItem"', ':', coalesce(vResult, '{}'));
  end if;
end;
$function$
