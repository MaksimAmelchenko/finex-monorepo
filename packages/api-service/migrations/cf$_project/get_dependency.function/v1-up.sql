CREATE OR REPLACE FUNCTION "cf$_project".get_dependency(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vDBegin   date;
  vDEnd     date;
  vToday    date := now();
  vMaxDPlan date;
begin
--  oResult := concat_ws (',', oResult, '"idProject":' || context.get('Id_Project'));
  -- Зависимые от проета сущности. Возврщаются после смены текущего проекта
  oResult := concat_ws (',', oResult, cf$_account.get ('{}'::jsonb));
  oResult := concat_ws (',', oResult, cf$_contractor.get ('{}'::jsonb));
  oResult := concat_ws (',', oResult, cf$_category.get ('{}'::jsonb));
  oResult := concat_ws (',', oResult, cf$_unit.get ('{}'::jsonb));
  oResult := concat_ws (',', oResult, cf$_tag.get ('{}'::jsonb));
  oResult := concat_ws (',', oResult, cf$_money.get ('{}'::jsonb));
  
  -- Получение интервала для отрисовки графика "ежедневные остатки" 
  select least (greatest(coalesce (min (cfd.DCashFlow_Detail), vToday), vToday - interval '5 months'), vToday),
         greatest (coalesce (max (cfd.DCashFlow_Detail), vToday), vToday)
    into vDBegin, 
         vDEnd
    from cf$.v_CashFlow_Detail cfd;
    
  if vDEnd < vToday + interval '5 months'
  then
    select max(s.DPlan)
      into vMaxDPlan
      from cf$.v_Plan p,
           cf$_plan.schedule(p.Id_Plan, p.DBegin, (vToday + interval '5 months')::date ) s;

    if vMaxDPlan > vDEnd 
    then
      vDEnd := vMaxDPlan;
    end if;
  end if;

  vDBegin := greatest(date_trunc('month', vDBegin - interval '1 month'), vDBegin);
  vDEnd := date_trunc('month', vDEnd + interval '1 month' + interval '1 month') - interval '1 day';

  oResult := concat_ws (',', oResult, 
    '"params":' || json_build_object('dashboard', json_build_object('dBegin', vDBegin,
                                                                    'dEnd', vDEnd)
                                    ));

  oResult := concat_ws (',', oResult, cf$_project.get_badges ());
end;
$function$
