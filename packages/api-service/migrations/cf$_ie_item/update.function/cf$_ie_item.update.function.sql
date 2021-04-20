CREATE OR REPLACE FUNCTION "cf$_ie_item".update(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vCashFlow_Detail cf$.v_CashFlow_Detail%rowtype;
  vNewTags         text;
  vTags            text[];
begin
  begin
    vCashFlow_Detail.Id_CashFlow_Detail := iParams->>'idIEDetail';
  exception
    when others 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idIEDetail" must be a number');
  end;

  if vCashFlow_Detail.Id_CashFlow_Detail is null
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idIEDetail" is required');
  end if;
    
 
  begin
    select cfd.*
      into strict vCashFlow_Detail
      from      cf$.v_CashFlow_Detail cfd
           join cf$.CashFlow cf on (    cf.Id_Project = cfd.Id_Project
                                    and cf.Id_CashFlow = cfd.Id_CashFlow)
     where cfd.Id_CashFlow_Detail = vCashFlow_Detail.Id_CashFlow_Detail
       and cf.Id_CashFlow_Type = 1;
  exception
    when no_data_found 
    then
      perform error$.raise ('no_data_found');
  end;

  if (iParams \? 'idAccount') 
  then
    begin
      vCashFlow_Detail.Id_Account := iParams->>'idAccount';
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idAccount" must be a number');
    end;

    if vCashFlow_Detail.Id_Account is null
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idAccount" is empty');
    end if;
  end if;

  if (iParams \? 'idCategory') 
  then
    begin
      vCashFlow_Detail.Id_Category := iParams->>'idCategory';
    exception
      when others 
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idCategory" must be a number');
    end;
    
    if vCashFlow_Detail.Id_Category is null
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idCategory" is empty');
    end if;
  end if;

  if (iParams \? 'idMoney') 
  then
    begin
      vCashFlow_Detail.Id_Money := iParams->>'idMoney';
    exception
      when others 
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idMoney" must be a number');
    end;

    if vCashFlow_Detail.Id_Money is null
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idMoney" is empty');
    end if;
  end if;

  if (iParams \? 'idUnit')
  then
    begin
      vCashFlow_Detail.Id_Unit = iParams->>'idUnit';
    exception
      when others
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idUnit" must be a number');
    end;
  end if;

  if (iParams \? 'sign') 
  then
    begin
      vCashFlow_Detail.Sign := iParams->>'sign';
    exception
      when others
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"sign" must be a number');
    end;

    if vCashFlow_Detail.Sign is null 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"sign" is empty');
    end if;
  end if;

  if (iParams \? 'dIEDetail') 
  then
    begin
      vCashFlow_Detail.DCashFlow_Detail := sanitize$.to_date (iParams->>'dIEDetail');
    exception
      when others
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"dIEDetail" must be a date');
    end;

    if vCashFlow_Detail.DCashFlow_Detail is null
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"dIEDetail" is empty');
    end if;
  end if;

  if (iParams \? 'reportPeriod') 
  then
    begin
      vCashFlow_Detail.Report_Period := sanitize$.to_date(iParams->>'reportPeriod');
    exception
      when others
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"reportPeriod" must be a date');
    end;

    if vCashFlow_Detail.Report_Period is null
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"reportPeriod" is empty');
    end if;
  end if;

  if (iParams \? 'quantity') 
  then
    begin
      vCashFlow_Detail.Quantity := iParams->>'quantity';
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"quantity" must be a numeric');
    end;
  end if;

  if (iParams \? 'sum')
  then
    begin
      vCashFlow_Detail.sum := iParams->>'sum';
    exception
      when others
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"sum" must be a numeric');
    end;

    if vCashFlow_Detail.sum is null
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"sum" is empty');
    end if;
  end if;

  if (iParams \? 'isNotConfirmed') 
  then
    begin
      vCashFlow_Detail.is_Not_Confirmed := (iParams->>'isNotConfirmed')::boolean;
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"isNotConfirmed" must be a boolean');
    end;

    if vCashFlow_Detail.is_Not_Confirmed is null
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"isNotConfirmed" is empty');
    end if;
  end if;

  if (iParams \? 'note')
  then
    vCashFlow_Detail.note := sanitize$.to_String (iParams->>'note');
  end if;

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

  begin
    update cf$.CashFlow_Detail cfd
       set Id_Account = vCashFlow_Detail.id_account,
           Id_Category = vCashFlow_Detail.Id_Category,
           Id_Money = vCashFlow_Detail.Id_Money,
           Id_unit = vCashFlow_Detail.Id_Unit,
           Sign = vCashFlow_Detail.Sign,
           DCashFlow_Detail = vCashFlow_Detail.dCashFlow_Detail,
           Report_Period = vCashFlow_Detail.Report_Period,
           Quantity = vCashFlow_Detail.Quantity,
           Sum = vCashFlow_Detail.Sum,
           Is_Not_Confirmed = vCashFlow_Detail.Is_Not_Confirmed,
           note = vCashFlow_Detail.Note,
           tags = vCashFlow_Detail.Tags
     where cfd.Id_Project = vCashFlow_Detail.Id_Project
       and cfd.Id_CashFlow_Detail = vCashFlow_Detail.Id_CashFlow_Detail;
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

  oResult := cf$_ie_item.get (('{"idIEDetail": ' || vCashFlow_Detail.Id_CashFlow_Detail::text || '}')::jsonb);

  if vNewTags is not null 
  then
    oResult := oResult || concat (',', '"newTags"', ':', '[', vNewTags ,']');
  end if;
end;
$function$
