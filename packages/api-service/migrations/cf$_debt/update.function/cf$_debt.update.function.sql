CREATE OR REPLACE FUNCTION "cf$_debt".update(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  r                record;
  vCashFlow        cf$.v_CashFlow%rowtype;
  vCashFlow_Detail cf$.v_CashFlow_Detail%rowtype;
  vNewTagsPart     text;
  vNewTags         text;
  vTags            text[];
begin

  begin
    vCashFlow.Id_CashFlow := iParams->>'idDebt';
  exception
    when others then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idDebt" must be a number');
  end;

  if vCashFlow.Id_CashFlow is null 
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idDebt" is required');
  end if;
 
  begin
    select cf.*
      into strict vCashFlow
      from cf$.v_CashFlow cf
     where cf.Id_CashFlow = vCashFlow.Id_CashFlow
       and cf.Id_CashFlow_Type = 2;
  exception
    when no_data_found then
      perform error$.raise ('no_data_found');
  end;

  if (iParams \? 'idContractor') 
  then
    begin
      vCashFlow.Id_Contractor := iParams->>'idContractor';
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idContractor" must be a number');
    end;
    
    if vCashFlow.Id_Contractor is null 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idContractor" is empty');
    end if;
  end if;

  if (iParams \? 'note') 
  then
    vCashFlow.Note := sanitize$.to_String (iParams->>'note');
  end if;

  if (iParams \? 'tags') 
  then
    begin
      vTags := array (select jsonb_array_elements_text(iParams->'tags'));  
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"tags" must be a json array');
    end;
        
    select oTags, oNew_Tags
      into vCashFlow.Tags, vNewTagsPart
      from cf$_tag.decode (vTags);

    if vNewTagsPart is not null 
    then
      vNewTags := concat_ws (',', vNewTags, vNewTagsPart);
    end if;
  end if;

  for r in (select d.detail
              from (select jsonb_array_elements(iParams->'debtDetails') detail) d) 
  loop
    vCashFlow_Detail := null;
    
    begin
      vCashFlow_Detail.Id_CashFlow_Detail := r.detail->>'idDebtDetail';
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"debtDetail.idDebtDetail" must be a number');
    end;
    
    if vCashFlow_Detail.Id_CashFlow_Detail is null 
    then
      -- Новая запись, проверка на присутствие всех полей
      vCashFlow_Detail.Quantity := 1;

      begin
        vCashFlow_Detail.Id_Account := r.detail->>'idAccount';
      exception
        when others then
          perform error$.raise ('invalid_parameters', iDev_Message := '"debtDetail.idAccount" must be a number');
      end;

      if vCashFlow_Detail.Id_Account is null then
        perform error$.raise ('invalid_parameters', iDev_Message := '"debtDetail.idAccount" is required');
      end if;

      begin
        vCashFlow_Detail.Id_Money := r.detail->>'idMoney';
      exception
        when others then
          perform error$.raise ('invalid_parameters', iDev_Message := '"debtDetail.idMoney" must be a number');
      end;

      if vCashFlow_Detail.Id_Money is null then
        perform error$.raise ('invalid_parameters', iDev_Message := '"debtDetail.idMoney" is required');
      end if;

      begin
        vCashFlow_Detail.Id_Category := r.detail->>'idCategory';
      exception
        when others then
          perform error$.raise ('invalid_parameters', iDev_Message := '"debtDetail.idCategory" must be a number');
      end;

      if vCashFlow_Detail.Id_Category is null then
        perform error$.raise ('invalid_parameters', iDev_Message := '"debtDetail.idCategory" is required');
      end if;

      begin
        vCashFlow_Detail.sign := r.detail->>'sign';
      exception
        when others then
          perform error$.raise ('invalid_parameters', iDev_Message := '"debtDetail.sign" must be a number');
      end;

      if vCashFlow_Detail.sign is null 
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"debtDetail.sign" is required');
      end if;

      begin
        vCashFlow_Detail.dCashFlow_Detail := sanitize$.to_date(r.detail->>'dDebtDetail');
      exception
        when others then
          perform error$.raise ('invalid_parameters', iDev_Message := '"debtDetail.dDebtDetail" must be a date');
      end;

      if vCashFlow_Detail.dCashFlow_Detail is null 
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"debtDetail.dDebtDetail" is required');
      end if;

      begin
        vCashFlow_Detail.Report_Period := sanitize$.to_date(r.detail->>'reportPeriod');
      exception
        when others then
          perform error$.raise ('invalid_parameters', iDev_Message := '"debtDetail.reportPeriod" must be a date');
      end;

      if vCashFlow_Detail.Report_Period is null 
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"debtDetail.reportPeriod" is required');
      end if;

      begin
        vCashFlow_Detail.sum := r.detail->>'sum';
      exception
        when others then
          perform error$.raise ('invalid_parameters', iDev_Message := '"debtDetail.sum" must be a numeric');
      end;

      if vCashFlow_Detail.sum is null 
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"debtDetail.sum" is required');
      end if;

      if (r.detail \? 'note') 
      then
        vCashFlow_Detail.note := sanitize$.to_String (r.detail->>'note');
      end if;

      if (r.detail \? 'tags') 
      then
        begin
          vTags := array (select jsonb_array_elements_text(r.detail->'tags'));
        exception
          when others then
            perform error$.raise ('invalid_parameters', iDev_Message := '"tags" must be a json array');
        end;
            
        select oTags, oNew_Tags
          into vCashFlow_Detail.Tags, vNewTagsPart
          from cf$_tag.decode (vTags);

        if vNewTagsPart is not null then
          vNewTags := concat_ws (',', vNewTags, vNewTagsPart);
        end if;
      end if;
      
      insert 
        into cf$.CashFlow_Detail (Id_CashFlow, 
                                  Id_Account, 
                                  Id_Category, 
                                  Id_Money, 
                                  Sign, 
                                  DCashFlow_Detail, 
                                  Report_Period,
                                  Quantity, 
                                  Sum, 
                                  Note,
                                  Tags)
        values (vCashFlow.Id_CashFlow, 
                vCashFlow_Detail.id_account,
                vCashFlow_Detail.Id_Category, 
                vCashFlow_Detail.Id_Money,
                vCashFlow_Detail.Sign,
                vCashFlow_Detail.DCashFlow_Detail,
                vCashFlow_Detail.Report_Period,
                vCashFlow_Detail.Quantity,
                vCashFlow_Detail.Sum,
                vCashFlow_Detail.Note,
                vCashFlow_Detail.Tags);
    else
      begin
        select cfd.*
          into strict vCashFlow_Detail
          from cf$.v_CashFlow_Detail cfd
         where cfd.Id_CashFlow_Detail = vCashFlow_Detail.Id_CashFlow_Detail;
      exception
        when no_data_found then
          perform error$.raise ('no_data_found');
      end;
      
      if (r.detail \? '_destroy') 
      then
        -- Удаление
        delete 
          from cf$.CashFlow_Detail cfd
         where cfd.Id_Project = vCashFlow_Detail.Id_Project
           and cfd.Id_CashFlow_Detail = vCashFlow_Detail.Id_CashFlow_Detail;
      else
        -- Обновление
        if (r.detail \? 'idAccount') 
        then
          begin
            vCashFlow_Detail.Id_Account := r.detail->>'idAccount';
          exception
            when others then
              perform error$.raise ('invalid_parameters', iDev_Message := '"debtDetail.idAccount" must be a number');
          end;

          if vCashFlow_Detail.Id_Account is null then
            perform error$.raise ('invalid_parameters', iDev_Message := '"debtDetail.idAccount" is empty');
          end if;
        end if;

        if (r.detail \? 'idMoney') 
        then
          begin
            vCashFlow_Detail.id_Money := r.detail->>'idMoney';
          exception
            when others then
              perform error$.raise ('invalid_parameters', iDev_Message := '"debtDetail.idMoney" must be a number');
          end;

          if vCashFlow_Detail.id_Money is null then
            perform error$.raise ('invalid_parameters', iDev_Message := '"debtDetail.idMoney" is empty');
          end if;

        end if;

        if (r.detail \? 'idCategory') 
        then
          begin
            vCashFlow_Detail.Id_Category := r.detail->>'idCategory';
          exception
            when others then
              perform error$.raise ('invalid_parameters', iDev_Message := '"debtDetail.idCategory" must be a number');
          end;

          if vCashFlow_Detail.Id_Category is null 
          then
            perform error$.raise ('invalid_parameters', iDev_Message := '"debtDetail.idCategory" is empty');
          end if;
        end if;

        if (r.detail \? 'sign') then
          begin
            vCashFlow_Detail.sign := r.detail->>'sign';
          exception
            when others then
              perform error$.raise ('invalid_parameters', iDev_Message := '"debtDetail.sign" must be a number');
          end;

          if vCashFlow_Detail.sign is null then
            perform error$.raise ('invalid_parameters', iDev_Message := '"debtDetail.sign" is empty');
          end if;
        end if;

        if (r.detail \? 'dDebtDetail') then
          begin
            vCashFlow_Detail.dCashFlow_Detail := sanitize$.to_date(r.detail->>'dDebtDetail');
          exception
            when others then
              perform error$.raise ('invalid_parameters', iDev_Message := '"debtDetail.dDebtDetail" must be a date');
          end;

          if vCashFlow_Detail.dCashFlow_Detail is null then
            perform error$.raise ('invalid_parameters', iDev_Message := '"debtDetail.sign" is empty');
          end if;
        end if;

        if (r.detail \? 'reportPeriod') 
        then
          begin
            vCashFlow_Detail.Report_Period := sanitize$.to_date(r.detail->>'reportPeriod');
          exception
            when others then
              perform error$.raise ('invalid_parameters', iDev_Message := '"debtDetail.reportPeriod" must be a date');
          end;

          if vCashFlow_Detail.Report_Period is null 
          then
            perform error$.raise ('invalid_parameters', iDev_Message := '"debtDetail.reportPeriod" is empty');
          end if;
        end if;

        if (r.detail \? 'sum') then
          begin
            vCashFlow_Detail.sum := r.detail->>'sum';
          exception
            when others then
              perform error$.raise ('invalid_parameters', iDev_Message := '"debtDetail.sum" must be a numeric');
          end;

          if vCashFlow_Detail.sum is null then
            perform error$.raise ('invalid_parameters', iDev_Message := '"debtDetail.sum" is empty');
          end if;
        end if;

        if (r.detail \? 'note') then
          vCashFlow_Detail.note := sanitize$.to_String (r.detail->>'note');
        end if;

        if (r.detail \? 'tags') then
          begin
            vTags := array (select jsonb_array_elements_text(r.detail->'tags'));
          exception
            when others then
              perform error$.raise ('invalid_parameters', iDev_Message := '"debtDetail.tags" must be a json array');
          end;
              
          select oTags, oNew_Tags
            into vCashFlow_Detail.Tags, vNewTagsPart
            from cf$_tag.decode (vTags);

          if vNewTagsPart is not null 
          then
            vNewTags := concat_ws (',', vNewTags, vNewTagsPart);
          end if;
        end if;
      
        update cf$.CashFlow_Detail cfd
           set id_account = vCashFlow_Detail.id_account,
               Id_Category = vCashFlow_Detail.Id_Category,
               id_Money = vCashFlow_Detail.Id_Money,
               sign = vCashFlow_Detail.Sign,
               dCashFlow_Detail = vCashFlow_Detail.dCashFlow_Detail,
               Report_Period = vCashFlow_Detail.Report_Period,
               sum = vCashFlow_Detail.Sum,
               note = vCashFlow_Detail.Note,
               tags = vCashFlow_Detail.Tags
         where cfd.Id_Project = vCashFlow_Detail.Id_Project
           and cfd.Id_CashFlow_Detail = vCashFlow_Detail.Id_CashFlow_Detail;
      end if;
    end if;
  end loop;

  update cf$.CashFlow cf
     set Id_Contractor = vCashFlow.Id_Contractor,
         note = vCashFlow.Note,
         tags = vCashFlow.Tags
   where cf.Id_Project = vCashFlow.Id_Project
     and cf.Id_CashFlow = vCashFlow.Id_CashFlow;

  oResult := cf$_debt.get (('{"idDebt": ' || vCashFlow.Id_CashFlow::text || '}')::jsonb);
  if vNewTags is not null 
  then
    oResult := oResult || concat (',', '"newTags"', ':', '[', vNewTags ,']');
  end if;
end;
$function$
