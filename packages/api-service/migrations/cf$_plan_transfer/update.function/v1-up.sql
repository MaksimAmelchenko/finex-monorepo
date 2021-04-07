CREATE OR REPLACE FUNCTION "cf$_plan_transfer".update(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vId_Project    cf$.Project.Id_Project%type := context.get('Id_Project');
  vPlan_Transfer cf$.Plan_Transfer%rowtype;
  vNew_Tags      text;
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
      from cf$.Plan_Transfer pt
     where pt.Id_Project = vId_Project
       and pt.Id_Plan = vPlan_Transfer.Id_Plan;
  exception
    when no_data_found
    then
      perform error$.raise ('no_data_found');
  end;

  if (iParams \? 'idAccountFrom')
  then
    begin
      vPlan_Transfer.Id_Account_From := iParams->>'idAccountFrom';
    exception
      when others
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountFrom" must be a number');
    end;

    if vPlan_Transfer.Id_Account_From is null
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountFrom" is empty');
    end if;
  end if;

  if (iParams \? 'idAccountTo')
  then
    begin
      vPlan_Transfer.Id_Account_To := iParams->>'idAccountTo';
    exception
      when others
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountTo" must be a number');
    end;

    if vPlan_Transfer.Id_Account_To is null
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountTo" is empty');
    end if;
  end if;

  if (iParams \? 'sum') 
  then
    begin
      vPlan_Transfer.sum := iParams->>'sum';
    exception
      when others 
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"sum" must be a numeric');
    end;

    if vPlan_Transfer.sum is null 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"sum" is empty');
    end if;
  end if;

  if (iParams \? 'idMoney') 
  then
    begin
      vPlan_Transfer.Id_Money := iParams->>'idMoney';
    exception
      when others 
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idMoney" must be a number');
    end;

    if vPlan_Transfer.Id_Money is null 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idMoney" is empty');
    end if;
  end if;

  if (iParams \? 'idAccountFee') 
  then
    begin
      vPlan_Transfer.Id_Account_Fee := iParams->>'idAccountFee';
    exception
      when others
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountFee" must be a number');
    end;
  end if;
  
  if (iParams \? 'fee')
  then
    begin
      vPlan_Transfer.fee := iParams->>'fee';
    exception
      when others 
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"fee" must be a numeric');
    end;
  end if;

  if (iParams \? 'idMoneyFee')
  then
    begin
      vPlan_Transfer.Id_Money_Fee := iParams->>'idMoneyFee';
    exception
      when others 
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idMoneyFee" must be a number');
    end;
  end if;

  vNew_Tags := cf$_plan.update(vPlan_Transfer.Id_Plan, iParams);

  begin
    update cf$.Plan_Transfer pt
       set Id_Account_From = vPlan_Transfer.Id_Account_From,
           Id_Account_To = vPlan_Transfer.Id_Account_To,
           Sum = vPlan_Transfer.Sum,
           Id_Money = vPlan_Transfer.Id_Money,
           Id_Account_Fee = vPlan_Transfer.Id_Account_Fee,
           Fee = vPlan_Transfer.Fee,
           Id_Money_Fee = vPlan_Transfer.Id_Money_Fee
     where pt.Id_Project = vPlan_Transfer.Id_Project
       and pt.Id_Plan = vPlan_Transfer.Id_Plan;
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

  oResult := cf$_plan_transfer.get (('{"idPlanTransfer": ' || vPlan_Transfer.Id_Plan::text || '}')::jsonb);

  if vNew_Tags is not null
  then
    oResult := oResult || concat (',', '"newTags"', ':', '[', vNew_Tags ,']');
  end if;
end;
$function$
