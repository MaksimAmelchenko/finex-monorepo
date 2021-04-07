CREATE OR REPLACE FUNCTION "cf$_project".get_badges(OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vResult                text;
  vCashFlow_Item_Planned int;
  vTransfer_Planned      int;
  vExchange_Planned      int;
begin
  select count(*)
    into vCashFlow_Item_Planned
    from cf$.v_Plan_CashFlow_Item pcfi,
         cf$_plan.schedule(pcfi.Id_Plan, pcfi.DBegin, (now() + interval '1 day')::date ) s;
 
  vResult := concat_ws (',', vResult, json_build_object('menuItem', 'ies_details',
                                                        'title', 'Количество запланированных операций',
                                                        'value', vCashFlow_Item_Planned));
         
  select count(*)
    into vTransfer_Planned
    from cf$.v_Plan_Transfer pt,
         cf$_plan.schedule(pt.Id_Plan, pt.DBegin, (now() + interval '1 day')::date ) s;

  vResult := concat_ws (',', vResult, json_build_object('menuItem', 'transfers',
                                                        'title', 'Количество запланированных переводов',
                                                        'value', vTransfer_Planned));

  select count(*)
    into vExchange_Planned
    from cf$.v_Plan_Exchange pe,
         cf$_plan.schedule(pe.Id_Plan, pe.DBegin, (now() + interval '1 day')::date ) s;

  vResult := concat_ws (',', vResult, json_build_object('menuItem', 'exchanges',
                                                        'title', 'Количество запланированных обменов',
                                                        'value', vExchange_Planned));


--  vResult := concat_ws (',', vResult, json_build_object('menuItem', 'plans',
--                                                        'title', '',
--                                                        'value', '!'));

  oResult := concat('"badges"', ':', concat ('[', vResult , ']'));
end;
$function$
