CREATE OR REPLACE FUNCTION "cf$_plan_cashflow_item".update(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vId_Project         cf$.Project.Id_Project%type := context.get('Id_Project');
  vPlan_CashFlow_Item cf$.Plan_CashFlow_Item%rowtype;
  vNew_Tags           text;
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
      from cf$.Plan_CashFlow_Item pcfi
     where pcfi.Id_Project = vId_Project
       and pcfi.Id_Plan = vPlan_CashFlow_Item.Id_Plan;
  exception
    when no_data_found
    then
      perform error$.raise ('no_data_found');
  end;

  if (iParams \? 'idContractor')
  then
    begin
      vPlan_CashFlow_Item.Id_Contractor := iParams->>'idContractor';
    exception
      when others 
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idContractor" must be a number');
    end;
  end if;

  if (iParams \? 'idAccount')
  then
    begin
      vPlan_CashFlow_Item.Id_Account := iParams->>'idAccount';
    exception
      when others
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idAccount" must be a number');
    end;

    if vPlan_CashFlow_Item.Id_Account is null
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idAccount" is empty');
    end if;
  end if;

  if (iParams \? 'idCategory')
  then
    begin
      vPlan_CashFlow_Item.Id_Category := iParams->>'idCategory';
    exception
      when others
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idCategory" must be a number');
    end;
    
    if vPlan_CashFlow_Item.Id_Category is null
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idCategory" is empty');
    end if;
  end if;

  if (iParams \? 'idMoney')
  then
    begin
      vPlan_CashFlow_Item.Id_Money := iParams->>'idMoney';
    exception
      when others 
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idMoney" must be a number');
    end;

    if vPlan_CashFlow_Item.Id_Money is null
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idMoney" is empty');
    end if;
  end if;

  if (iParams \? 'idUnit')
  then
    begin
      vPlan_CashFlow_Item.Id_Unit := iParams->>'idUnit';
    exception
      when others
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idUnit" must be a number');
    end;
  end if;

  if (iParams \? 'sign')
  then
    begin
      vPlan_CashFlow_Item.Sign := iParams->>'sign';
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"sign" must be a number');
    end;

    if vPlan_CashFlow_Item.Sign is null
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"sign" is empty');
    end if;
  end if;

  if (iParams \? 'quantity')
  then
    begin
      vPlan_CashFlow_Item.Quantity := iParams->>'quantity';
    exception
      when others
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"quantity" must be a numeric');
    end;
  end if;

  if (iParams \? 'sum')
  then
    begin
      vPlan_CashFlow_Item.sum := iParams->>'sum';
    exception
      when others
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"sum" must be a numeric');
    end;

    if vPlan_CashFlow_Item.sum is null
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"sum" is empty');
    end if;
  end if;

  vNew_Tags := cf$_plan.update(vPlan_CashFlow_Item.Id_Plan, iParams);

  begin
    update cf$.Plan_CashFlow_Item pcfi
       set Id_Contractor = vPlan_CashFlow_Item.Id_Contractor,
           Id_Account = vPlan_CashFlow_Item.Id_Account,
           Id_Category = vPlan_CashFlow_Item.Id_Category,
           Id_Money = vPlan_CashFlow_Item.Id_Money,
           Id_Unit = vPlan_CashFlow_Item.Id_Unit,
           Sign = vPlan_CashFlow_Item.Sign,
           Quantity = vPlan_CashFlow_Item.Quantity,
           Sum = vPlan_CashFlow_Item.Sum
     where pcfi.Id_Project = vPlan_CashFlow_Item.Id_Project
       and pcfi.Id_Plan = vPlan_CashFlow_Item.Id_Plan;
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
