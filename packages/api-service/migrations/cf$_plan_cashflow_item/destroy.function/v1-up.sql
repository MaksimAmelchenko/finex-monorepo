CREATE OR REPLACE FUNCTION "cf$_plan_cashflow_item".destroy(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vPlan_CashFlow_Item    cf$.v_Plan_CashFlow_Item%rowtype;
begin
  begin
    vPlan_CashFlow_Item.Id_Plan := iParams->>'idPlanCashFlowItem';
  exception
    when others
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idPlanCashFlowItem" must be a number');
  end;
  
  if vPlan_CashFlow_Item.Id_Plan is null 
  then
	  perform error$.raise ('invalid_parameters', iDev_Message := '"idPlanCashFlowItem" is required');
  end if;

  begin
    select pcfi.*
      into strict vPlan_CashFlow_Item
      from cf$.v_Plan_CashFlow_Item pcfi
     where pcfi.Id_Plan = vPlan_CashFlow_Item.Id_Plan;
  exception
    when no_data_found
    then
      perform error$.raise ('no_data_found');
  end;

  delete 
    from cf$.Plan p
   where p.Id_Project = vPlan_CashFlow_Item.Id_Project
     and p.Id_Plan = vPlan_CashFlow_Item.Id_Plan;
end;
$function$
