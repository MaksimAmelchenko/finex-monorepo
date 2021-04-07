CREATE OR REPLACE FUNCTION "cf$_transfer".update(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  r         record;
  vCashFlow cf$.v_CashFlow%rowtype;

  vCashFlow_Detail_From cf$.v_CashFlow_Detail%rowtype;
  vCashFlow_Detail_To   cf$.v_CashFlow_Detail%rowtype;
  vCashFlow_Detail_Fee  cf$.v_CashFlow_Detail%rowtype;
  
  vIsFee       boolean;
  vNewTags     text;
  vTags        text[];
  --
  vId_Category_Transfer     cf$.Category.Id_Category%type;
  vId_Category_Transfer_Fee cf$.Category.Id_Category%type;
begin

  begin
    vCashFlow.Id_CashFlow := iParams->>'idTransfer';
  exception
    when others then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idTransfer" must be a number');
  end;

  if vCashFlow.Id_CashFlow is null then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idTransfer" is required');
  end if;
  
  begin
    select cf.*
      into strict vCashFlow
      from cf$.v_CashFlow cf
     where cf.Id_CashFlow = vCashFlow.Id_CashFlow
       and cf.Id_CashFlow_Type = 3;
  exception
    when no_data_found then
      perform error$.raise ('no_data_found');
  end;
  
  select c.Id_Category
    into strict vId_Category_Transfer
    from cf$.v_Category c
   where c.Id_Category_Prototype = 11;
    
  select Id_Category
    into strict vId_Category_Transfer_Fee
    from cf$.v_Category c
   where c.Id_Category_Prototype = 12;
  
  begin
    select cfd.*
      into strict vCashFlow_Detail_From
      from cf$.v_CashFlow_Detail cfd
     where cfd.Id_CashFlow = vCashFlow.Id_CashFlow
       and cfd.Id_Category = vId_Category_Transfer
       and cfd.sign = -1;
  exception
    when no_data_found then
      perform error$.raise ('no_data_found', iMore_Info := 'transfer record is corrupted');
  end;

  begin
    select cfd.*
      into strict vCashFlow_Detail_To
      from cf$.v_cashFlow_Detail cfd
     where cfd.Id_CashFlow = vCashFlow.Id_CashFlow
       and cfd.Id_Category = vId_Category_Transfer
       and cfd.sign = 1;
  exception
    when no_data_found then
      perform error$.raise ('no_data_found', iMore_Info := 'transfer record is corrupted');
  end;

  -- Fee
  begin
    select cfd.*
      into strict vCashFlow_Detail_Fee
      from cf$.v_cashFlow_Detail cfd
     where cfd.Id_CashFlow = vCashFlow.Id_CashFlow
       and cfd.Id_Category = vId_Category_Transfer_Fee;
  exception
    when no_data_found then
      vCashFlow_Detail_Fee := null;
      vCashFlow_Detail_Fee.DCashFlow_Detail := vCashFlow_Detail_From.DCashFlow_Detail;
      vCashFlow_Detail_Fee.Report_Period := vCashFlow_Detail_From.Report_Period;
  end;

  if (iParams \? 'note') then
    vCashFlow.Note := sanitize$.to_String (iParams->>'note');
  end if;

  if (iParams \? 'tags') then
    begin
      vTags := array (select jsonb_array_elements_text(iParams->'tags'));
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"tags" must be a json array');
    end;
        
    select oTags, oNew_Tags
      into vCashFlow.Tags, vNewTags
      from cf$_tag.decode (vTags);
  end if;

  if (iParams \? 'dTransfer') then
    begin
      vCashFlow_Detail_From.dCashFlow_Detail := sanitize$.to_date (iParams->>'dTransfer');
      vCashFlow_Detail_To.dCashFlow_Detail := vCashFlow_Detail_From.dCashFlow_Detail;
      vCashFlow_Detail_Fee.dCashFlow_Detail := vCashFlow_Detail_From.dCashFlow_Detail;
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"dTransfer" must be a date');
    end;

    if vCashFlow_Detail_From.dCashFlow_Detail is null then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idTransfer" is empty');
    end if;
  end if;

  if (iParams \? 'reportPeriod') then
    begin
      vCashFlow_Detail_From.Report_Period := sanitize$.to_date (iParams->>'reportPeriod');
      vCashFlow_Detail_To.Report_Period := vCashFlow_Detail_From.Report_Period;
      vCashFlow_Detail_Fee.Report_Period := vCashFlow_Detail_From.Report_Period;
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"reportPeriod" must be a date');
    end;

    if vCashFlow_Detail_From.Report_Period is null then
      perform error$.raise ('invalid_parameters', iDev_Message := '"reportPeriod" is empty');
    end if;
  end if;

  if (iParams \? 'idAccountFrom') then
    begin
      vCashFlow_Detail_From.Id_Account := iParams->>'idAccountFrom';
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountFrom" must be a number');
    end;

    if vCashFlow_Detail_From.Id_Account is null then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountFrom" is empty');
    end if;
  end if;

  if (iParams \? 'idAccountTo') then
    begin
      vCashFlow_Detail_To.Id_Account := iParams->>'idAccountTo';
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountTo" must be a number');
    end;

    if vCashFlow_Detail_To.Id_Account is null then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountTo" is empty');
    end if;
  end if;

  if (iParams \? 'idMoney') then
    begin
      vCashFlow_Detail_From.Id_Money := iParams->>'idMoney';
      vCashFlow_Detail_To.Id_Money := vCashFlow_Detail_From.Id_Money;
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idMoney" must be a number');
    end;

    if vCashFlow_Detail_To.Id_Money is null then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idMoney" is empty');
    end if;
  end if;

  if (iParams \? 'sum') then
    begin
      vCashFlow_Detail_From.sum := iParams->>'sum';
      vCashFlow_Detail_To.sum := vCashFlow_Detail_From.sum;
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"sum" must be a numeric');
    end;

    if vCashFlow_Detail_From.Sum is null then
      perform error$.raise ('invalid_parameters', iDev_Message := '"sum" is empty');
    end if;
  end if;
 
  -- check
  if vCashFlow_Detail_From.Id_Account = vCashFlow_Detail_To.Id_Account then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountFrom" and "idAccountTo" are the same');
  end if;
  
  update cf$.CashFlow_Detail cfd
         set id_account = vCashFlow_Detail_From.id_account,
             id_Money = vCashFlow_Detail_From.Id_Money,
             dCashFlow_Detail = vCashFlow_Detail_From.dCashFlow_Detail,
             Report_Period = vCashFlow_Detail_From.Report_Period,
             sum = vCashFlow_Detail_From.Sum
       where cfd.Id_Project = vCashFlow_Detail_From.Id_Project
         and cfd.Id_CashFlow_Detail = vCashFlow_Detail_From.Id_CashFlow_Detail;

  update cf$.CashFlow_Detail cfd
         set id_account = vCashFlow_Detail_To.id_account,
             id_Money = vCashFlow_Detail_To.Id_Money,
             dCashFlow_Detail = vCashFlow_Detail_To.dCashFlow_Detail,
             Report_Period = vCashFlow_Detail_To.Report_Period,
             sum = vCashFlow_Detail_To.Sum
       where cfd.Id_Project = vCashFlow_Detail_To.Id_Project
         and cfd.Id_CashFlow_Detail = vCashFlow_Detail_To.Id_CashFlow_Detail;
         
  if (iParams \? 'isFee') then
    begin
      vIsFee := (iParams->>'isFee')::boolean;
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"isFee" must be true or false');
    end;
  else
    -- Если есть хоть одно из полей комиссии, то считаем, что есть комиссия и все поля должны быть заполненны
    vIsFee := iParams \? 'idAccountFee' or iParams \? 'idMoneyFee' or iParams \? 'fee';
  end if;
    
  if not vIsFee then
    if vCashFlow_Detail_Fee.Id_CashFlow_Detail is not null then
      delete 
        from cf$.CashFlow_Detail cfd
       where cfd.Id_Project = vCashFlow_Detail_Fee.Id_Project
         and cfd.Id_CashFlow_Detail = vCashFlow_Detail_Fee.Id_CashFlow_Detail;
    end if;   
  else
    if (iParams \? 'idAccountFee') then
      begin
        vCashFlow_Detail_Fee.Id_Account := iParams->>'idAccountFee';
      exception
        when others then
          perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountFee" must be a number');
      end;

      if vCashFlow_Detail_Fee.Id_Account is null then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountFee" is empty');
      end if;
    end if;    

    if vCashFlow_Detail_Fee.Id_Account is null and vCashFlow_Detail_Fee.Id_CashFlow_Detail is null then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idAccountFee" is required');
    end if;
        
    if (iParams \? 'idMoneyFee') then
      begin
        vCashFlow_Detail_Fee.Id_Money := iParams->>'idMoneyFee';
      exception
        when others then
          perform error$.raise ('invalid_parameters', iDev_Message := '"idMoneyFee" must be a number');
      end;

      if vCashFlow_Detail_Fee.Id_Money is null then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idMoneyFee" is empty');
      end if;
    end if;

    if vCashFlow_Detail_Fee.Id_Money is null and vCashFlow_Detail_Fee.Id_CashFlow_Detail is null then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idMoneyFee" is required');
    end if;

    if (iParams \? 'fee') then
      begin
        vCashFlow_Detail_Fee.Sum := iParams->>'fee';
      exception
        when others then
          perform error$.raise ('invalid_parameters', iDev_Message := '"fee" must be a numeric');
      end;

      if vCashFlow_Detail_Fee.Sum is null then
        perform error$.raise ('invalid_parameters', iDev_Message := '"fee" is empty');
      end if;
    end if;

    if vCashFlow_Detail_Fee.Sum is null and vCashFlow_Detail_Fee.Id_CashFlow_Detail is null then
      perform error$.raise ('invalid_parameters', iDev_Message := '"fee" is required');
    end if;
        
    if vCashFlow_Detail_Fee.Id_CashFlow_Detail is null then
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
        values (vCashFlow.Id_CashFlow, 
                vCashFlow_Detail_Fee.id_account,
                vId_Category_Transfer_Fee, 
                vCashFlow_Detail_Fee.Id_Money,
                -1,
                vCashFlow_Detail_Fee.DCashFlow_Detail,
                vCashFlow_Detail_Fee.Report_Period,
                1,
                vCashFlow_Detail_Fee.Sum);
    else
      update cf$.CashFlow_Detail cfd
             set id_account = vCashFlow_Detail_Fee.id_account,
                 id_Money = vCashFlow_Detail_Fee.Id_Money,
                 dCashFlow_Detail = vCashFlow_Detail_Fee.dCashFlow_Detail,
                 Report_Period = vCashFlow_Detail_Fee.Report_Period,
                 sum = vCashFlow_Detail_Fee.Sum
           where cfd.Id_Project = vCashFlow_Detail_Fee.Id_Project
             and cfd.Id_CashFlow_Detail = vCashFlow_Detail_Fee.Id_CashFlow_Detail;
    end if;
  end if;

  update cf$.CashFlow cf
     set note = vCashFlow.Note,
         tags = vCashFlow.Tags
   where cf.Id_Project = vCashFlow.Id_Project
     and cf.Id_CashFlow = vCashFlow.Id_CashFlow;

  oResult := cf$_transfer.get (('{"idTransfer": ' || vCashFlow.Id_CashFlow::text || '}')::jsonb);

  if vNewTags is not null then
    oResult := oResult || concat (',', '"newTags"', ':', '[', vNewTags ,']');
  end if;
end;
$function$
