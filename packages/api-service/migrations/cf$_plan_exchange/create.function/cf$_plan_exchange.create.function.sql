CREATE OR REPLACE FUNCTION "cf$_plan_exchange"."create"(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vPlan_Exchange cf$.Plan_Exchange%rowtype;
  vNew_Tags      text;
begin
  begin
    vPlan_Exchange.Id_Account_From := iParams->>'idAccountFrom';
  exception
    when others
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountFrom" must be a number');
  end;

  if vPlan_Exchange.Id_Account_From is null
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountFrom" is required');
  end if;

  begin
    vPlan_Exchange.Sum_From := iParams->>'sumFrom';
  exception
    when others 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"sumFrom" must be a numeric');
  end;

  if vPlan_Exchange.Sum_From is null 
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"sumFrom" is required');
  end if;

  begin
    vPlan_Exchange.Id_Money_From := iParams->>'idMoneyFrom';
  exception
    when others 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idMoneyFrom" must be a number');
  end;

  if vPlan_Exchange.Id_Money_From is null 
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idMoneyFrom" is required');
  end if;

  begin
    vPlan_Exchange.Id_Account_To := iParams->>'idAccountTo';
  exception
    when others 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountTo" must be a number');
  end;

  if vPlan_Exchange.Id_Account_To is null 
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountTo" is required');
  end if;

  begin
    vPlan_Exchange.Sum_To := iParams->>'sumTo';
  exception
    when others
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"sumTo" must be a numeric');
  end;

  if vPlan_Exchange.Sum_To is null 
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"sumTo" is required');
  end if;

  begin
    vPlan_Exchange.Id_Money_To := iParams->>'idMoneyTo';
  exception
    when others 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idMoneyTo" must be a number');
  end;

  if vPlan_Exchange.Id_Money_To is null 
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idMoneyTo" is required');
  end if;

  begin
    vPlan_Exchange.Id_Account_Fee := iParams->>'idAccountFee';
  exception
    when others 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountFee" must be a number');
  end;

  begin
    vPlan_Exchange.Fee := iParams->>'fee';
  exception
    when others 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"fee" must be a numeric');
  end;

  begin
    vPlan_Exchange.Id_Money_Fee := iParams->>'idMoneyFee';
  exception
    when others 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idMoneyFee" must be a number');
  end;

  select p.Id_Plan,
         p.New_Tags
    into vPlan_Exchange.Id_Plan
         vNew_Tags
    from cf$_plan.create(iParams) p;
  
  begin
    insert into cf$.Plan_Exchange (Id_Plan,
                                   Id_Account_From,
                                   Sum_From,
                                   Id_Money_From,
                                   Id_Account_To, 
                                   Sum_To,
                                   Id_Money_To, 
                                   Id_Account_Fee, 
                                   Fee,
                                   Id_Money_Fee)
         values (vPlan_Exchange.Id_Plan,
                 vPlan_Exchange.Id_Account_From, 
                 vPlan_Exchange.Sum_From, 
                 vPlan_Exchange.Id_Money_From,
                 vPlan_Exchange.Id_Account_To, 
                 vPlan_Exchange.Sum_To, 
                 vPlan_Exchange.Id_Money_To, 
                 vPlan_Exchange.Id_Account_Fee, 
                 vPlan_Exchange.Fee, 
                 vPlan_Exchange.Id_Money_Fee);
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
    oResult := oResult || concat (',', '"newTags"', ':', '[', vNew_Tags ,']');
  end if;
end;
$function$
