CREATE OR REPLACE FUNCTION "cf$_plan_cashflow_item"."create"(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vPlan_CashFlow_Item   cf$.Plan_CashFlow_Item%rowtype;
  vNew_Tags         text;
begin
  begin
    vPlan_CashFlow_Item.Id_Contractor := iParams->>'idContractor';
  exception
    when others
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idContractor" must be a number');
  end;

  begin
    vPlan_CashFlow_Item.Id_Account := iParams->>'idAccount';
  exception
    when others
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idAccount" must be a number');
  end;

  if vPlan_CashFlow_Item.Id_Account is null
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idAccount" is required');
  end if;

  begin
    vPlan_CashFlow_Item.Id_Category := iParams->>'idCategory';
  exception
    when others
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idCategory" must be a number');
  end;

  if vPlan_CashFlow_Item.Id_Category is null
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idCategory" is required');
  end if;

  begin
    vPlan_CashFlow_Item.Id_Money := iParams->>'idMoney';
  exception
    when others
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idMoney" must be a number');
  end;

  if vPlan_CashFlow_Item.Id_Money is null
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idMoney" is required');
  end if;

  begin
    vPlan_CashFlow_Item.Id_Unit := iParams->>'idUnit';
  exception
    when others
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idUnit" must be a number');
  end;

  begin
    vPlan_CashFlow_Item.sign := iParams->>'sign';
  exception
    when others 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"sign" must be a number');
  end;

  if vPlan_CashFlow_Item.sign is null
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"sign" is required');
  end if;

  begin
    vPlan_CashFlow_Item.quantity := iParams->>'quantity';
  exception
    when others
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"quantity" must be a numeric');
  end;

  begin
    vPlan_CashFlow_Item.sum := iParams->>'sum';
  exception
    when others
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"sum" must be a numeric');
  end;

  if vPlan_CashFlow_Item.sum is null
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"sum" is required');
  end if;

  select p.Id_Plan,
         p.New_Tags
    into vPlan_CashFlow_Item.Id_Plan
         vNew_Tags
    from cf$_plan.create(iParams) p;

  begin
    insert into cf$.Plan_CashFlow_Item (Id_Plan,
                                        Id_Contractor, 
                                        Id_Account, 
                                        Id_Category, 
                                        Id_Money, 
                                        Id_Unit, 
                                        Sign, 
                                        Quantity, 
                                        Sum)
         values (vPlan_CashFlow_Item.Id_Plan,
                 vPlan_CashFlow_Item.Id_Contractor, 
                 vPlan_CashFlow_Item.Id_Account, 
                 vPlan_CashFlow_Item.Id_Category, 
                 vPlan_CashFlow_Item.Id_Money, 
                 vPlan_CashFlow_Item.Id_Unit, 
                 vPlan_CashFlow_Item.Sign, 
                 vPlan_CashFlow_Item.Quantity, 
                 vPlan_CashFlow_Item.Sum);
  exception
    when unique_violation
    then
      declare
        vConstraint_Name text;
      begin    
        get stacked diagnostics vConstraint_Name = CONSTRAINT_NAME;
        perform error$.raise ('unique_violation.' || vConstraint_Name, idb_message := SQLERRM);
      end;
    when check_violation
    then
      declare
        vConstraint_Name text;
      begin    
        get stacked diagnostics vConstraint_Name = CONSTRAINT_NAME;
        perform error$.raise ('check_violation.' || vConstraint_Name, idb_message := SQLERRM);
      end;
  end;

  oResult := cf$_plan_cashflow_item.get (('{"idPlanCashFlowItem": ' || vPlan_CashFlow_Item.Id_Plan::text || '}')::jsonb);

  if vNew_Tags is not null
  then
    oResult := oResult || concat (',', '"newTags"', ':', '[', vNew_Tags ,']');
  end if;
end;
$function$
