CREATE OR REPLACE FUNCTION "cf$_plan_exchange".update(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vId_Project    cf$.Project.Id_Project%type := context.get('Id_Project');
  vPlan_Exchange cf$.Plan_Exchange%rowtype;
  vNew_Tags      text;
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
      from cf$.Plan_Exchange pe
     where pe.Id_Project = vId_Project
       and pe.Id_Plan = vPlan_Exchange.Id_Plan;
  exception
    when no_data_found
    then
      perform error$.raise ('no_data_found');
  end;

  if (iParams \? 'idAccountFrom')
  then
    begin
      vPlan_Exchange.Id_Account_From := iParams->>'idAccountFrom';
    exception
      when others
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountFrom" must be a number');
    end;

    if vPlan_Exchange.Id_Account_From is null
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountFrom" is empty');
    end if;
  end if;

  if (iParams \? 'sumFrom') 
  then
    begin
      vPlan_Exchange.Sum_From := iParams->>'sumFrom';
    exception
      when others 
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"sumFrom" must be a numeric');
    end;

    if vPlan_Exchange.Sum_From is null 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"sumFrom" is empty');
    end if;
  end if;

  if (iParams \? 'idMoneyFrom') 
  then
    begin
      vPlan_Exchange.Id_Money_From := iParams->>'idMoneyFrom';
    exception
      when others 
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idMoneyFrom" must be a number');
    end;

    if vPlan_Exchange.Id_Money_From is null 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idMoneyFrom" is empty');
    end if;
  end if;

  if (iParams \? 'idAccountTo')
  then
    begin
      vPlan_Exchange.Id_Account_To := iParams->>'idAccountTo';
    exception
      when others
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountTo" must be a number');
    end;

    if vPlan_Exchange.Id_Account_To is null
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountTo" is empty');
    end if;
  end if;

  if (iParams \? 'sumTo') 
  then
    begin
      vPlan_Exchange.Sum_To := iParams->>'sumTo';
    exception
      when others 
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"sumTo" must be a numeric');
    end;

    if vPlan_Exchange.Sum_To is null 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"sumTo" is empty');
    end if;
  end if;

  if (iParams \? 'idMoneyTo') 
  then
    begin
      vPlan_Exchange.Id_Money_To := iParams->>'idMoneyTo';
    exception
      when others 
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idMoneyTo" must be a number');
    end;

    if vPlan_Exchange.Id_Money_To is null 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idMoneyTo" is empty');
    end if;
  end if;

  if (iParams \? 'idAccountFee') 
  then
    begin
      vPlan_Exchange.Id_Account_Fee := iParams->>'idAccountFee';
    exception
      when others
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountFee" must be a number');
    end;
  end if;
  
  if (iParams \? 'fee') 
  then
    begin
      vPlan_Exchange.fee := iParams->>'fee';
    exception
      when others 
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"fee" must be a numeric');
    end;
  end if;

  if (iParams \? 'idMoneyFee') 
  then
    begin
      vPlan_Exchange.Id_Money_Fee := iParams->>'idMoneyFee';
    exception
      when others
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idMoneyFee" must be a number');
    end;
  end if;

  vNew_Tags := cf$_plan.update(vPlan_Exchange.Id_Plan, iParams);
    
  begin
    update cf$.Plan_Exchange pe
       set Id_Account_From = vPlan_Exchange.Id_Account_From,
           Sum_From = vPlan_Exchange.Sum_From,
           Id_Money_From = vPlan_Exchange.Id_Money_From,
           Id_Account_To = vPlan_Exchange.Id_Account_To,
           Sum_To = vPlan_Exchange.Sum_To,
           Id_Money_To = vPlan_Exchange.Id_Money_To,
           Id_Account_Fee = vPlan_Exchange.Id_Account_Fee,
           Fee = vPlan_Exchange.Fee,
           Id_Money_Fee = vPlan_Exchange.Id_Money_Fee
     where pe.Id_Project = vPlan_Exchange.Id_Project
       and pe.Id_Plan = vPlan_Exchange.Id_Plan;
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

  oResult := cf$_plan_exchange.get (('{"idPlanExchange": ' || vPlan_Exchange.Id_Plan::text || '}')::jsonb);

  if vNew_Tags is not null
  then
    oResult := oResult || concat (',', '"newTags"', ':', '[', vNewTags ,']');
  end if;
end;
$function$
