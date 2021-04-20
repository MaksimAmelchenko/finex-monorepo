CREATE OR REPLACE FUNCTION "cf$_plan_transfer".destroy(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vPlan_Transfer cf$.v_Plan_Transfer%rowtype;
begin
  begin
    vPlan_Transfer.Id_Plan := iParams->>'idPlanTransfer';
  exception
    when others 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idPlanTransfer" must be a number');
  end;
  
  if vPlan_Transfer.Id_Plan is null
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idPlanTransfer" is required');
  end if;

  begin
    select pt.*
      into strict vPlan_Transfer
      from cf$.v_Plan_Transfer pt
     where pt.Id_Plan = vPlan_Transfer.Id_Plan;
  exception
    when no_data_found
    then
      perform error$.raise ('no_data_found');
  end;
  
  delete 
    from cf$.Plan p
   where p.Id_Project = vPlan_Transfer.Id_Project
     and p.Id_Plan = vPlan_Transfer.Id_Plan;
end;
$function$
