CREATE OR REPLACE FUNCTION "cf$_transfer"."create"(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vCashFlow             cf$.v_CashFlow%rowtype;

  vCashFlow_Detail_From cf$.v_CashFlow_Detail%rowtype;
  vCashFlow_Detail_To   cf$.v_CashFlow_Detail%rowtype;
  vCashFlow_Detail_Fee  cf$.v_CashFlow_Detail%rowtype;
  
  vIsFee   boolean;
  vNewTags text;
  vTags    text[];

  vId_Plan         cf$.Plan.Id_Plan%type;

  vId_Category_Transfer     cf$.Category.Id_Category%type := cf$_Category.get_Category_by_Prototype(11);
  vId_Category_Transfer_Fee cf$.Category.Id_Category%type := cf$_Category.get_Category_by_Prototype(12);
begin
  vCashFlow.Note := sanitize$.to_String (iParams->>'note');

  begin
    vId_Plan := iParams->>'idPlan';
  exception
    when others 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idPlan" must be a number');
  end;

  if (iParams \? 'tags')
  then
    begin
      vTags := array (select jsonb_array_elements_text(iParams->'tags'));
    exception
      when others
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"tags" must be a json array');
    end;
        
    select oTags,
           oNew_Tags
      into vCashFlow.Tags, 
           vNewTags
      from cf$_tag.decode (vTags);
  end if;

  begin
    vCashFlow_Detail_From.dCashFlow_Detail := sanitize$.to_date (iParams->>'dTransfer');
    vCashFlow_Detail_To.dCashFlow_Detail := vCashFlow_Detail_From.dCashFlow_Detail;
    vCashFlow_Detail_Fee.dCashFlow_Detail := vCashFlow_Detail_From.dCashFlow_Detail;
  exception
    when others
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"dTransfer" must be a date');
  end;

  if vCashFlow_Detail_From.dCashFlow_Detail is null
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"dTransfer" is required');
  end if;

  begin
    vCashFlow_Detail_From.Report_Period := sanitize$.to_date (iParams->>'reportPeriod');
    vCashFlow_Detail_To.Report_Period := vCashFlow_Detail_From.Report_Period;
    vCashFlow_Detail_Fee.Report_Period := vCashFlow_Detail_From.Report_Period;
  exception
    when others
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"reportPeriod" must be a date');
  end;

  if vCashFlow_Detail_From.Report_Period is null
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"reportPeriod" is required');
  end if;

  begin
    vCashFlow_Detail_From.Id_Account := iParams->>'idAccountFrom';
  exception
    when others
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountFrom" must be a number');
  end;

  if vCashFlow_Detail_From.Id_Account is null
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountFrom" is required');
  end if;

  begin
    vCashFlow_Detail_To.Id_Account := iParams->>'idAccountTo';
  exception
    when others
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountTo" must be a number');
  end;

  if vCashFlow_Detail_To.Id_Account is null
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountTo" is required');
  end if;

  begin
    vCashFlow_Detail_From.Id_Money := iParams->>'idMoney';
    vCashFlow_Detail_To.Id_Money := vCashFlow_Detail_From.Id_Money;
  exception
    when others
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idMoney" must be a number');
  end;

  if vCashFlow_Detail_From.Id_Money is null
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idMoney" is required');
  end if;

  begin
    vCashFlow_Detail_From.sum := iParams->>'sum';
    vCashFlow_Detail_To.sum := vCashFlow_Detail_From.sum;
  exception
    when others
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"sum" must be a numeric');
  end;

  if vCashFlow_Detail_From.sum is null
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"sum" is required');
  end if;

  vIsFee := false;
  if (iParams \? 'isFee') then
    begin
      vIsFee := (iParams->>'isFee')::boolean;
    exception
      when others
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"isFee" must be true or false');
    end;
--  else
    -- Значения есть, но они пустые
--    vIsFee := case when iParams \? 'idAccountFee' or iParams \? 'idMoneyFee' or iParams \? 'fee' then 1 else 0 end;
  end if;
  
  if vIsFee 
  then
    begin
      vCashFlow_Detail_Fee.Id_Account := iParams->>'idAccountFee';
    exception
      when others
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountFee" must be a number');
    end;

    if vCashFlow_Detail_Fee.Id_Account is null
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountFee" is required');
    end if;
        
    begin
      vCashFlow_Detail_Fee.Id_Money := iParams->>'idMoneyFee';
    exception
      when others
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idMoneyFee" must be a number');
    end;

    if vCashFlow_Detail_Fee.Id_Money is null
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idMoneyFee" is required');
    end if;

    begin
      vCashFlow_Detail_Fee.Sum := iParams->>'fee';
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"fee" must be a numeric');
    end;

    if vCashFlow_Detail_Fee.Sum is null
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"fee" is required');
    end if;
  end if;

 -- check
  if vCashFlow_Detail_From.Id_Account = vCashFlow_Detail_To.Id_Account
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountFrom" and "idAccountTo" are the same');
  end if;

  insert into cf$.CashFlow (Id_CashFlow_Type, note, Tags)
       values (3, vCashFlow.Note, vCashFlow.Tags)
    returning Id_CashFlow
         into vCashFlow.Id_CashFlow;    
    
  insert 
    into cf$.CashFlow_Detail (Id_CashFlow, 
                              Id_Account, 
                              Id_Category, 
                              Id_Money, 
                              Sign, 
                              DCashFlow_Detail, 
                              Report_Period,
                              Quantity, 
                              Sum)
    (select vCashFlow.Id_CashFlow, vCashFlow_Detail_From.Id_Account, vId_Category_Transfer, 
            vCashFlow_Detail_From.Id_Money, -1, vCashFlow_Detail_From.DCashFlow_Detail,
            vCashFlow_Detail_From.Report_Period, 1, vCashFlow_Detail_From.Sum
      union all       
     select vCashFlow.Id_CashFlow, vCashFlow_Detail_To.Id_Account, vId_Category_Transfer, 
            vCashFlow_Detail_To.Id_Money,  1, vCashFlow_Detail_To.DCashFlow_Detail,
            vCashFlow_Detail_To.Report_Period, 1, vCashFlow_Detail_To.Sum
      union all
     select vCashFlow.Id_CashFlow, vCashFlow_Detail_Fee.Id_Account, vId_Category_Transfer_Fee, 
            vCashFlow_Detail_Fee.Id_Money, -1, vCashFlow_Detail_Fee.DCashFlow_Detail,
            vCashFlow_Detail_Fee.Report_Period, 1, vCashFlow_Detail_Fee.Sum
      where vIsFee = true
     );

  if vId_Plan is not null
  then
    insert into cf$.Plan_Exclude (Id_Plan, DExclude, Action_Type)
         values (vId_Plan, vCashFlow_Detail_From.DCashFlow_Detail, 1);
  end if;

  oResult := cf$_transfer.get (('{"idTransfer": ' || vCashFlow.Id_CashFlow::text || '}')::jsonb);
  
  if vNewTags is not null
  then
    oResult := oResult || concat (',', '"newTags"', ':', '[', vNewTags ,']');
  end if;
end;
$function$
