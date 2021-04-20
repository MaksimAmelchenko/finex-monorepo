CREATE OR REPLACE FUNCTION "cf$_ie_item"."create"(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vId_CashFlow     cf$.CashFlow.Id_CashFlow%type;
  vCashFlow_Detail cf$.CashFlow_Detail%rowtype;
  vNewTags         text;
  vTags            text[];
  vId_Contractor   cf$.CashFlow.Id_Contractor%type;
  vId_Plan         cf$.Plan.Id_Plan%type;
begin
  begin
    vId_Contractor := iParams->>'idContractor';
  exception
    when others 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idContractor" must be a number');
  end;

  -- TODO не нравится использования "чужого" свойства idPlan для фиксации момента, что
  -- запланированная операция принята, но так реально проще
  begin
    vId_Plan := iParams->>'idPlan';
  exception
    when others 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idPlan" must be a number');
  end;

  begin
    vCashFlow_Detail.Id_Account := iParams->>'idAccount';
  exception
    when others 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idAccount" must be a number');
  end;

  if vCashFlow_Detail.Id_Account is null 
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idAccount" is required');
  end if;

  begin
    vCashFlow_Detail.id_Money := iParams->>'idMoney';
  exception
    when others 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idMoney" must be a number');
  end;

  if vCashFlow_Detail.Id_Money is null 
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idMoney" is required');
  end if;

  begin
    vCashFlow_Detail.Id_Category := iParams->>'idCategory';
  exception
    when others
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idCategory" must be a number');
  end;

  if vCashFlow_Detail.Id_Category is null
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idCategory" is required');
  end if;

  begin
    vCashFlow_Detail.Id_Unit := iParams->>'idUnit';
  exception
    when others
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idUnit" must be a number');
  end;

  begin
    vCashFlow_Detail.sign := iParams->>'sign';
  exception
    when others then
      perform error$.raise ('invalid_parameters', iDev_Message := '"sign" must be a number');
  end;

  if vCashFlow_Detail.sign is null
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"sign" is required');
  end if;

  begin
    vCashFlow_Detail.DCashFlow_Detail := sanitize$.to_date (iParams->>'dIEDetail');
  exception
    when others
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"dIEDetail" must be a date');
  end;

  if vCashFlow_Detail.DCashFlow_Detail is null 
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"dIEDetail" is required');
  end if;

  begin
    vCashFlow_Detail.Report_Period := sanitize$.to_date (iParams->>'reportPeriod');
  exception
    when others
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"reportPeriod" must be a date');
  end;

  if vCashFlow_Detail.Report_Period is null
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"reportPeriod" is required');
  end if;

  begin
    vCashFlow_Detail.Quantity := iParams->>'quantity';
  exception
    when others
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"quantity" must be a numeric');
  end;

  begin
    vCashFlow_Detail.sum := iParams->>'sum';
  exception
    when others
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"sum" must be a numeric');
  end;

  if vCashFlow_Detail.sum is null
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"sum" is required');
  end if;

  begin
    vCashFlow_Detail.Is_Not_Confirmed := coalesce ((iParams->>'isNotConfirmed')::boolean, false);
  exception
    when others
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"isNotConfirmed" must be a boolean');
  end;
  
  vCashFlow_Detail.note := sanitize$.to_String (iParams->>'note');

  if (iParams \? 'tags')
  then
    begin
      vTags := array (select jsonb_array_elements_text(iParams->'tags'));
    exception
      when others
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"tags" must be a json array');
    end;

    select oTags, oNew_Tags
      into vCashFlow_Detail.Tags, vNewTags
      from cf$_tag.decode (vTags);
  end if;

  insert into cf$.CashFlow (Id_CashFlow_Type, Id_Contractor)
       values (1, vId_Contractor)
    returning Id_CashFlow
         into vId_CashFlow;
      
  begin
    insert into cf$.CashFlow_Detail (Id_CashFlow, 
                                     Id_Account, 
                                     Id_Category, 
                                     Id_Money, 
                                     Id_Unit, 
                                     Sign, 
                                     DCashFlow_Detail, 
                                     Report_Period,
                                     Quantity, 
                                     Sum, 
                                     Is_Not_Confirmed,
                                     Note,
                                     Tags)
        values (vId_CashFlow, 
                vCashFlow_Detail.Id_Account,
                vCashFlow_Detail.Id_Category, 
                vCashFlow_Detail.Id_Money,
                vCashFlow_Detail.Id_Unit,
                vCashFlow_Detail.Sign,
                vCashFlow_Detail.DCashFlow_Detail,
                vCashFlow_Detail.Report_Period,
                vCashFlow_Detail.Quantity,
                vCashFlow_Detail.Sum,
                vCashFlow_Detail.Is_Not_Confirmed,
                vCashFlow_Detail.Note,
                vCashFlow_Detail.Tags)
      returning Id_CashFlow_Detail
           into vCashFlow_Detail.Id_CashFlow_Detail;
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
  
  if vId_Plan is not null
  then
    insert into cf$.Plan_Exclude (Id_Plan, DExclude, Action_Type)
         values (vId_Plan, vCashFlow_Detail.DCashFlow_Detail, 1);
  end if;

  oResult := cf$_ie_item.get (('{"idIEDetail": ' || vCashFlow_Detail.Id_CashFlow_Detail::text || '}')::jsonb);

  if vNewTags is not null
  then
    oResult := oResult || concat (',', '"newTags"', ':', '[', vNewTags ,']');
  end if;
end;
$function$
