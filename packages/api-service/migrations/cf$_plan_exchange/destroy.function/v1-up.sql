CREATE OR REPLACE FUNCTION "cf$_plan_exchange".destroy(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vPlan_Exchange cf$.v_Plan_Exchange%rowtype;
begin
  begin
    vPlan_Exchange.Id_Plan := iParams->>'idPlanExchange';
  exception
    when others 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idPlanExchange" must be a number');
  end;
  
  if vPlan_Exchange.Id_Plan is null
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idPlanExchange" is required');
  end if;

  begin
    select pe.*
      into strict vPlan_Exchange
      from cf$.v_Plan_Exchange pe
     where pe.Id_Plan = vPlan_Exchange.Id_Plan;
  exception
    when no_data_found
    then
      perform error$.raise ('no_data_found');
  end;

  delete 
    from cf$.Plan p
   where p.Id_Project = vPlan_Exchange.Id_Project
     and p.Id_Plan = vPlan_Exchange.Id_Plan;
end;
$function$
