CREATE OR REPLACE FUNCTION "cf$_plan_transfer"."create"(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vPlan_Transfer cf$.v_Plan_Transfer%rowtype;

  vNew_Tags      text;
  vTags          text[];
begin
  begin
    vPlan_Transfer.Id_Account_From := iParams->>'idAccountFrom';
  exception
    when others 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountFrom" must be a number');
  end;

  if vPlan_Transfer.Id_Account_From is null 
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountFrom" is required');
  end if;

  begin
    vPlan_Transfer.Id_Account_To := iParams->>'idAccountTo';
  exception
    when others 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountTo" must be a number');
  end;

  if vPlan_Transfer.Id_Account_To is null 
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountTo" is required');
  end if;

  begin
    vPlan_Transfer.sum := iParams->>'sum';
  exception
    when others 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"sum" must be a numeric');
  end;

  if vPlan_Transfer.sum is null 
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"sum" is required');
  end if;

  begin
    vPlan_Transfer.Id_Money := iParams->>'idMoney';
  exception
    when others 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idMoney" must be a number');
  end;

  if vPlan_Transfer.Id_Money is null 
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idMoney" is required');
  end if;

  begin
    vPlan_Transfer.Id_Account_Fee := iParams->>'idAccountFee';
  exception
    when others 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountFee" must be a number');
  end;
    
  begin
    vPlan_Transfer.Fee := iParams->>'fee';
  exception
    when others 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"fee" must be a numeric');
  end;

  begin
    vPlan_Transfer.Id_Money_Fee := iParams->>'idMoneyFee';
  exception
    when others 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idMoneyFee" must be a number');
  end;

  select p.Id_Plan,
         p.New_Tags
    into vPlan_Transfer.Id_Plan
         vNew_Tags
    from cf$_plan.create(iParams) p;

  begin
    insert into cf$.Plan_Transfer (Id_Plan,
                                   Id_Account_From,
                                   Id_Account_To, 
                                   Sum,
                                   Id_Money, 
                                   Id_Account_Fee, 
                                   Fee,
                                   Id_Money_Fee)
         values (vPlan_Transfer.Id_Plan,
                 vPlan_Transfer.Id_Account_From, 
                 vPlan_Transfer.Id_Account_To, 
                 vPlan_Transfer.Sum, 
                 vPlan_Transfer.Id_Money, 
                 vPlan_Transfer.Id_Account_Fee, 
                 vPlan_Transfer.Fee, 
                 vPlan_Transfer.Id_Money_Fee);
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
    oResult := oResult || concat (',', '"newTags"', ':', '[', vNewTags ,']');
  end if;
end;
$function$
