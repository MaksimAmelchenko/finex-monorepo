CREATE OR REPLACE FUNCTION "cf$_exchange".update(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vCashFlow        cf$.v_CashFlow%rowtype;

  vCashFlow_Detail_From cf$.v_CashFlow_Detail%rowtype;
  vCashFlow_Detail_To   cf$.v_CashFlow_Detail%rowtype;
  vCashFlow_Detail_Fee  cf$.v_CashFlow_Detail%rowtype;
  
  vNew_Tags  text;
  vTags      text[];

  vId_Category_Exchange     cf$.Category.Id_Category%type := cf$_Category.get_Category_by_Prototype(21);
  vId_Category_Exchange_Fee cf$.Category.Id_Category%type := cf$_Category.get_Category_by_Prototype(22);
begin
  begin
    vCashFlow.Id_CashFlow := iParams->>'idExchange';
  exception
    when others
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idExchange" must be a number');
  end;

  if vCashFlow.Id_CashFlow is null
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idExchange" is required');
  end if;
 
  begin
    select cf.*
      into strict vCashFlow
      from cf$.v_CashFlow cf
     where cf.Id_CashFlow = vCashFlow.Id_CashFlow
       and cf.Id_CashFlow_Type = 4;
  exception
    when no_data_found
    then
      perform error$.raise ('no_data_found');
  end;

  begin
    select cfd.*
      into strict vCashFlow_Detail_From
      from cf$.v_cashFlow_Detail cfd
     where cfd.Id_CashFlow = vCashFlow.Id_CashFlow
       and cfd.Id_Category = vId_Category_Exchange
       and cfd.sign = -1;
  exception
    when no_data_found
    then
      perform error$.raise ('no_data_found', iMore_Info := 'an exchange record is corrupted');
  end;

  begin
    select cfd.*
      into strict vCashFlow_Detail_To
      from cf$.v_CashFlow_Detail cfd
     where cfd.Id_CashFlow = vCashFlow.Id_CashFlow
       and cfd.Id_Category = vId_Category_Exchange
       and cfd.sign = 1;
  exception
    when no_data_found
    then
      perform error$.raise ('no_data_found', iMore_Info := 'an exchange record is corrupted');
  end;

  -- Fee
  begin
    select cfd.*
      into strict vCashFlow_Detail_Fee
      from cf$.v_CashFlow_Detail cfd
     where cfd.Id_CashFlow = vCashFlow.Id_CashFlow
       and cfd.Id_Category = vId_Category_Exchange_Fee;
  exception
    when no_data_found
    then
      vCashFlow_Detail_Fee := null;
      vCashFlow_Detail_Fee.DCashFlow_Detail := vCashFlow_Detail_From.DCashFlow_Detail;
      vCashFlow_Detail_Fee.Report_Period := vCashFlow_Detail_From.Report_Period;
  end;

  if (iParams \? 'note')
  then
    vCashFlow.Note := sanitize$.to_String (iParams->>'note');
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
        
    select oTags, 
           oNew_Tags
      into vCashFlow.Tags, 
           vNew_Tags
      from cf$_tag.decode (vTags);
  end if;

  if (iParams \? 'dExchange')
  then
    begin
      vCashFlow_Detail_From.DCashFlow_Detail := sanitize$.to_date(iParams->>'dExchange');
      vCashFlow_Detail_To.DCashFlow_Detail := vCashFlow_Detail_From.DCashFlow_Detail;
      vCashFlow_Detail_Fee.DCashFlow_Detail := vCashFlow_Detail_From.DCashFlow_Detail;
    exception
      when others
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"dExchange" must be a date');
    end;

    if vCashFlow_Detail_From.DCashFlow_Detail is null
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"dExchange" is empty');
    end if;
  end if;

  if (iParams \? 'reportPeriod') 
  then
    begin
      vCashFlow_Detail_From.Report_Period := sanitize$.to_date(iParams->>'reportPeriod');
      vCashFlow_Detail_To.Report_Period := vCashFlow_Detail_From.Report_Period;
      vCashFlow_Detail_Fee.Report_Period := vCashFlow_Detail_From.Report_Period;
    exception
      when others
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"reportPeriod" must be a date');
    end;

    if vCashFlow_Detail_From.Report_Period is null
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"reportPeriod" is empty');
    end if;
  end if;

  if (iParams \? 'idAccountFrom') 
  then
    begin
      vCashFlow_Detail_From.Id_Account := iParams->>'idAccountFrom';
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountFrom" must be a number');
    end;

    if vCashFlow_Detail_From.Id_Account is null
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountFrom" is empty');
    end if;
  end if;

  if (iParams \? 'idAccountTo') 
  then
    begin
      vCashFlow_Detail_To.Id_Account := iParams->>'idAccountTo';
    exception
      when others
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountTo" must be a number');
    end;

    if vCashFlow_Detail_To.Id_Account is null
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountTo" is empty');
    end if;
  end if;

  if (iParams \? 'idMoneyFrom') 
  then
    begin
      vCashFlow_Detail_From.Id_Money := iParams->>'idMoneyFrom';
    exception
      when others 
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idMoneyFrom" must be a number');
    end;

    if vCashFlow_Detail_From.Id_Money is null 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idMoneyFrom" is empty');
    end if;
  end if;

  if (iParams \? 'sumFrom')
  then
    begin
      vCashFlow_Detail_From.sum := iParams->>'sumFrom';
    exception
      when others
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"sumFrom" must be a numeric');
    end;

    if vCashFlow_Detail_From.sum is null
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"sumFrom" is empty');
    end if;
  end if;

  if (iParams \? 'idMoneyTo') 
  then
    begin
      vCashFlow_Detail_To.Id_Money := iParams->>'idMoneyTo';
    exception
      when others
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idMoneyTo" must be a number');
    end;

    if vCashFlow_Detail_To.Id_Money is null
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idMoneyTo" is empty');
    end if;
  end if;

  if (iParams \? 'sumTo') 
  then
    begin
      vCashFlow_Detail_To.sum := iParams->>'sumTo';
    exception
      when others
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"sumFrom" must be a numeric');
    end;

    if vCashFlow_Detail_To.sum is null
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"sumFrom" is empty');
    end if;
  end if;

  if vCashFlow_Detail_From.Id_Money = vCashFlow_Detail_To.Id_Money
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idMoneyFrom" and "idMoneyTo" are the same');
  end if;

  update cf$.CashFlow_Detail cfd
     set Id_Account = vCashFlow_Detail_From.id_account,
         Id_Money = vCashFlow_Detail_From.Id_Money,
         DCashFlow_Detail = vCashFlow_Detail_From.dCashFlow_Detail,
         Report_Period = vCashFlow_Detail_From.Report_Period,
         Sum = vCashFlow_Detail_From.Sum
   where cfd.Id_Project = vCashFlow_Detail_From.Id_Project
     and cfd.Id_CashFlow_Detail = vCashFlow_Detail_From.Id_CashFlow_Detail;

  update cf$.CashFlow_Detail cfd
     set Id_Account = vCashFlow_Detail_To.id_account,
         Id_Money = vCashFlow_Detail_To.Id_Money,
         DCashFlow_Detail = vCashFlow_Detail_To.dCashFlow_Detail,
         Report_Period = vCashFlow_Detail_To.Report_Period,
         Sum = vCashFlow_Detail_To.Sum
   where cfd.Id_Project = vCashFlow_Detail_To.Id_Project
     and cfd.Id_CashFlow_Detail = vCashFlow_Detail_To.Id_CashFlow_Detail;
         
  if     (iParams->>'idAccountFee') is null
     and (iParams->>'fee') is null
     and (iParams->>'idMoneyFee') is null
  then
    if vCashFlow_Detail_Fee.Id_CashFlow_Detail is not null
    then
      delete 
        from cf$.CashFlow_Detail cfd
       where cfd.Id_Project = vCashFlow_Detail_Fee.Id_Project
         and cfd.Id_CashFlow_Detail = vCashFlow_Detail_Fee.Id_CashFlow_Detail;
    end if;   
  else
    if (iParams \? 'idAccountFee') 
    then
      begin
        vCashFlow_Detail_Fee.Id_Account := iParams->>'idAccountFee';
      exception
        when others
        then
          perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountFee" must be a number');
      end;
    end if;

    if     vCashFlow_Detail_Fee.Id_Account is null
       and vCashFlow_Detail_Fee.Id_CashFlow_Detail is null 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountFee" is required');
    end if;
        
    if (iParams \? 'idMoneyFee') 
    then
      begin
        vCashFlow_Detail_Fee.Id_Money := iParams->>'idMoneyFee';
      exception
        when others
        then
          perform error$.raise ('invalid_parameters', iDev_Message := '"idMoneyFee" must be a number');
      end;
    end if;

    if     vCashFlow_Detail_Fee.Id_Money is null 
       and vCashFlow_Detail_Fee.Id_CashFlow_Detail is null
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idMoneyFee" is required');
    end if;

    if (iParams \? 'fee') 
    then
      begin
        vCashFlow_Detail_Fee.Sum := iParams->>'fee';
      exception
        when others
        then
          perform error$.raise ('invalid_parameters', iDev_Message := '"fee" must be a numeric');
      end;
    end if;
    
    if     vCashFlow_Detail_Fee.Sum is null
       and vCashFlow_Detail_Fee.Id_CashFlow_Detail is null
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"fee" is required');
    end if;
        
    if vCashFlow_Detail_Fee.Id_CashFlow_Detail is null
    then
      insert into cf$.CashFlow_Detail (Id_CashFlow, Id_Account, Id_Category, 
                                       Id_Money, Sign, 
                                       DCashFlow_Detail, Report_Period, Sum)
           values (vCashFlow.Id_CashFlow, vCashFlow_Detail_Fee.Id_Account, vId_Category_Exchange_Fee,
                   vCashFlow_Detail_Fee.Id_Money, -1,
                   vCashFlow_Detail_Fee.DCashFlow_Detail, vCashFlow_Detail_Fee.Report_Period, vCashFlow_Detail_Fee.Sum);
        
    else
      update cf$.CashFlow_Detail cfd
         set Id_Account = vCashFlow_Detail_Fee.Id_Account,
             Id_Money = vCashFlow_Detail_Fee.Id_Money,
             DCashFlow_Detail = vCashFlow_Detail_Fee.dCashFlow_Detail,
             Report_Period = vCashFlow_Detail_Fee.Report_Period,
             Sum = vCashFlow_Detail_Fee.Sum
       where cfd.Id_Project = vCashFlow_Detail_Fee.Id_Project
         and cfd.Id_CashFlow_Detail = vCashFlow_Detail_Fee.Id_CashFlow_Detail;
    end if;
  end if;

  update cf$.CashFlow cf
     set Note = vCashFlow.Note,
         Tags = vCashFlow.Tags
   where cf.Id_Project = vCashFlow.Id_Project
     and cf.Id_CashFlow = vCashFlow.Id_CashFlow;

  oResult := cf$_exchange.get (('{"idExchange": ' || vCashFlow.Id_CashFlow::text || '}')::jsonb);

  if vNew_Tags is not null
  then
    oResult := oResult || concat (',', '"newTags"', ':', '[', vNew_Tags ,']');
  end if;
end;
$function$
