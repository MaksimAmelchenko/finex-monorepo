CREATE OR REPLACE FUNCTION "cf$_ie".update(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  r                record;
  vCashFlow        cf$.v_CashFlow%rowtype;
  vCashFlow_Detail cf$.v_CashFlow_Detail%rowtype;
  
  vNewTags     text;
  vNewTagsPart text;
  vTags        text[];
  
begin
  begin
    vCashFlow.Id_CashFlow := iParams->>'idIE';
  exception
    when others 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idIE" must be a number');
  end;

  if vCashFlow.Id_CashFlow is null 
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idIE" is required');
  end if;
 
  begin
    select cf.*
      into strict vCashFlow
      from cf$.v_CashFlow cf
     where cf.Id_CashFlow = vCashFlow.Id_CashFlow
       and cf.Id_CashFlow_Type = 1;
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
  end if;

  if (iParams \? 'note') then
    vCashFlow.Note = sanitize$.to_String(iParams->>'note');
  end if;

  if (iParams \? 'tags') then
     begin
      vTags := array (select jsonb_array_elements_text(iParams->'tags'));
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"tags" must be a json array');
    end;
        
    select oTags, oNew_Tags
      into vCashFlow.Tags, vNewTagsPart
      from cf$_tag.decode (vTags);

    if vNewTagsPart is not null then
      vNewTags := concat_ws (',', vNewTags, vNewTagsPart);
    end if;
  end if;

  for r in (select d.ieDetail
              from (select jsonb_array_elements(iParams->'ieDetails') ieDetail) d) 
  loop
    vCashFlow_Detail := null;

    begin
      vCashFlow_Detail.Id_CashFlow_Detail := r.ieDetail->>'idIEDetail';
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.idIEDetail" must be a number');
    end;
    
    if vCashFlow_Detail.Id_CashFlow_Detail is null then
      
      -- Новая запись, проверка на присутствие всех полей
      begin
        vCashFlow_Detail.Id_Account := r.ieDetail->>'idAccount';
      exception
        when others then
          perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.idAccount" must be a number');
      end;

      if vCashFlow_Detail.Id_Account is null then
        perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.idAccount" is required');
      end if;

      begin
        vCashFlow_Detail.Id_Money := r.ieDetail->>'idMoney';
      exception
        when others then
          perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.idMoney" must be a number');
      end;

      if vCashFlow_Detail.Id_Money is null then
        perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.idMoney" is required');
      end if;

      begin
        vCashFlow_Detail.Id_Category := r.ieDetail->>'idCategory';
      exception
        when others then
          perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.idCategory" must be a number');
      end;

      if vCashFlow_Detail.Id_Category is null then
        perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.idCategory" is required');
      end if;

      begin
        vCashFlow_Detail.id_Unit := r.ieDetail->>'idUnit';
      exception
        when others then
          perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.idUnit" must be a number');
      end;

      begin
        vCashFlow_Detail.sign := r.ieDetail->>'sign';
      exception
        when others then
          perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.sign" must be a number');
      end;

      if vCashFlow_Detail.sign is null then
        perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.sign" is required');
      end if;

      begin
        vCashFlow_Detail.dCashFlow_Detail := sanitize$.to_Date (r.ieDetail->>'dIEDetail');
      exception
        when others then
          perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.dIEDetail" must be a date');
      end;

      if vCashFlow_Detail.dCashFlow_Detail is null then
        perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.dIEDetail" is required');
      end if;

      begin
        vCashFlow_Detail.Report_Period := sanitize$.to_Date(r.ieDetail->>'reportPeriod');
      exception
        when others then
          perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.reportPeriod" must be a date');
      end;

      if vCashFlow_Detail.Report_Period is null then
        perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.reportPeriod" is required');
      end if;
      
      begin
        vCashFlow_Detail.quantity := r.ieDetail->>'quantity';
      exception
        when others then
          perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.quantity" must be a numeric');
      end;

      if vCashFlow_Detail.quantity is null then
        perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.quantity" is required');
      end if;

      begin
        vCashFlow_Detail.sum := r.ieDetail->>'sum';
      exception
        when others then
          perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.sum" must be a numeric');
      end;

      if vCashFlow_Detail.sum is null then
        perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.sum" is required');
      end if;

      begin
        vCashFlow_Detail.is_Not_Confirmed := coalesce((r.ieDetail->>'isNotConfirmed')::boolean, false);
      exception
        when others then
          perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.isNotConfirmed" must be a boolean');
      end;

      vCashFlow_Detail.note := sanitize$.to_String(r.ieDetail->>'note');

      if (r.ieDetail \? 'tags') then
        begin
          vTags := array (select jsonb_array_elements_text(r.ieDetail->'tags'));
        exception
          when others then
            perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.tags" must be a json array');
        end;

        select oTags, oNew_Tags
          into vCashFlow_Detail.Tags, vNewTagsPart
          from cf$_tag.decode (vTags);

        if vNewTagsPart is not null then
          vNewTags := concat_ws (',', vNewTags, vNewTagsPart);
        end if;
      end if;
      
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
          values (vCashFlow.Id_CashFlow, 
                  vCashFlow_Detail.id_account,
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
                  vCashFlow_Detail.Tags);
      exception
        when unique_violation then
          declare
            vConstraint_Name text;
          begin    
            get stacked diagnostics vConstraint_Name = CONSTRAINT_NAME;
            perform error$.raise ('unique_violation.' || vConstraint_Name, idb_message := SQLERRM);
          end;
        when check_violation then
          declare
            vConstraint_Name text;
          begin    
            get stacked diagnostics vConstraint_Name = CONSTRAINT_NAME;
            perform error$.raise ('check_violation.' || vConstraint_Name, idb_message := SQLERRM);
          end;
      end;
    else
      -- Передали Id_CashFlow_Detail
      begin
        select cfd.*
          into strict vCashFlow_Detail
          from cf$.v_CashFlow_Detail cfd
         where cfd.Id_CashFlow = vCashFlow.Id_CashFlow
           and cfd.Id_CashFlow_Detail = vCashFlow_Detail.Id_CashFlow_Detail;
      exception
        when no_data_found then
          perform error$.raise ('no_data_found');
      end;
      
      if (r.ieDetail \? '_destroy') then
        delete 
          from cf$.CashFlow_Detail cfd
         where cfd.Id_Project = vCashFlow.Id_Project
           and cfd.Id_CashFlow = vCashFlow.Id_CashFlow
           and cfd.Id_CashFlow_Detail = vCashFlow_Detail.Id_CashFlow_Detail;
      else
        -- Update / Patch
        if (r.ieDetail \? 'idAccount') then
          begin
            vCashFlow_Detail.Id_Account := r.ieDetail->>'idAccount';
          exception
            when others then
              perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.idAccount" must be a number');
          end;

          if vCashFlow_Detail.Id_Account is null then
            perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.idAccount" is empty');
          end if;
        end if;

        if (r.ieDetail \? 'idMoney') 
        then
          begin
            vCashFlow_Detail.Id_Money := r.ieDetail->>'idMoney';
          exception
            when others then
              perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.idMoney" must be a number');
          end;

          if vCashFlow_Detail.Id_Money is null then
            perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.idMoney" is empty');
          end if;
        end if;

        if (r.ieDetail \? 'idCategory') 
        then
          begin
            vCashFlow_Detail.Id_Category := r.ieDetail->>'idCategory';
          exception
            when others then
              perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.idCategory" must be a number');
          end;

          if vCashFlow_Detail.Id_Category is null then
            perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.idCategory" is empty');
          end if;
        end if;

        if (r.ieDetail \? 'idUnit') 
        then
          begin
            vCashFlow_Detail.id_Unit := r.ieDetail->>'idUnit';
          exception
            when others then
              perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.idUnit" must be a number');
          end;
        end if;

        if (r.ieDetail \? 'sign') then
          begin
            vCashFlow_Detail.sign := r.ieDetail->>'sign';
          exception
            when others then
              perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.sign" must be a number');
          end;

          if vCashFlow_Detail.sign is null then
            perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.sign" is empty');
          end if;
        end if;

        if (r.ieDetail \? 'dIEDetail') then
          begin
            vCashFlow_Detail.dCashFlow_Detail := sanitize$.to_date (r.ieDetail->>'dIEDetail');
          exception
            when others then
              perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.dIEDetail" must be a date');
          end;

          if vCashFlow_Detail.dCashFlow_Detail is null then
            perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.dIEDetail" is empty');
          end if;
        end if;

        if (r.ieDetail \? 'reportPeriod') then
          begin
            vCashFlow_Detail.Report_Period := sanitize$.to_date (r.ieDetail->>'reportPeriod');
          exception
            when others then
              perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.reportPeriod" must be a date');
          end;

          if vCashFlow_Detail.Report_Period is null then
            perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.reportPeriod" is empty');
          end if;
        end if;

        if (r.ieDetail \? 'quantity') then
          begin
            vCashFlow_Detail.quantity := r.ieDetail->>'quantity';
          exception
            when others then
              perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.quantity" must be a numeric');
          end;

          if vCashFlow_Detail.quantity is null then
            perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.quantity" is empty');
          end if;
        end if;

        if (r.ieDetail \? 'sum') 
        then
          begin
            vCashFlow_Detail.sum := r.ieDetail->>'sum';
          exception
            when others then
              perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.sum" must be a numeric');
          end;

          if vCashFlow_Detail.sum is null then
            perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.sum" is empty');
          end if;
        end if;

        if (r.ieDetail \? 'isNotConfirmed') then
          begin
            vCashFlow_Detail.is_Not_Confirmed := (r.ieDetail->>'isNotConfirmed')::boolean;
          exception
            when others then
              perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.isNotConfirmed" must be a boolean');
          end;

          if vCashFlow_Detail.is_Not_Confirmed is null then
            perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.isNotConfirmed" is empty');
          end if;
        end if;

        if (r.ieDetail \? 'note') then
          vCashFlow_Detail.note := sanitize$.to_String (r.ieDetail->>'note');
        end if;

        if (r.ieDetail \? 'tags') then
          begin
            vTags := array (select jsonb_array_elements_text(r.ieDetail->'tags'));
          exception
            when others then
              perform error$.raise ('invalid_parameters', iDev_Message := '"ieDetail.tags" must be a json array');
          end;

          select oTags, oNew_Tags
            into vCashFlow_Detail.Tags, vNewTagsPart
            from cf$_tag.decode (vTags);

          if vNewTagsPart is not null then
            vNewTags := concat_ws (',', vNewTags, vNewTagsPart);
          end if;
        end if;
      
        begin
          update cf$.CashFlow_Detail cfd
             set id_account = vCashFlow_Detail.id_account,
                 Id_Category = vCashFlow_Detail.Id_Category,
                 id_Money = vCashFlow_Detail.Id_Money,
                 id_unit = vCashFlow_Detail.Id_Unit,
                 sign = vCashFlow_Detail.Sign,
                 dCashFlow_Detail = vCashFlow_Detail.dCashFlow_Detail,
                 Report_Period = vCashFlow_Detail.Report_Period,
                 quantity = vCashFlow_Detail.Quantity,
                 sum = vCashFlow_Detail.Sum,
                 Is_Not_Confirmed = vCashFlow_Detail.Is_Not_Confirmed,
                 note = vCashFlow_Detail.Note,
                 tags = vCashFlow_Detail.Tags
           where cfd.Id_Project = vCashFlow.Id_Project
             and cfd.Id_CashFlow = vCashFlow.Id_CashFlow
             and cfd.Id_CashFlow_Detail = vCashFlow_Detail.Id_CashFlow_Detail;
        exception
          when unique_violation then
            declare
              vConstraint_Name text;
            begin    
              get stacked diagnostics vConstraint_Name = CONSTRAINT_NAME;
              perform error$.raise ('unique_violation.' || vConstraint_Name, idb_message := SQLERRM);
            end;
          when check_violation then
            declare
              vConstraint_Name text;
            begin    
              get stacked diagnostics vConstraint_Name = CONSTRAINT_NAME;
              perform error$.raise ('check_violation.' || vConstraint_Name, idb_message := SQLERRM);
            end;
        end;
      end if;
    end if;
  end loop;

  begin
    update cf$.CashFlow cf
       set Id_Contractor = vCashFlow.Id_Contractor,
           note = vCashFlow.Note,
           tags = vCashFlow.Tags
     where cf.Id_Project = vCashFlow.Id_Project
       and cf.Id_CashFlow = vCashFlow.Id_CashFlow;
  exception
    when unique_violation then
      declare
        vConstraint_Name text;
      begin    
        get stacked diagnostics vConstraint_Name = CONSTRAINT_NAME;
        perform error$.raise ('unique_violation.' || vConstraint_Name, idb_message := SQLERRM);
      end;
    when check_violation then
      declare
        vConstraint_Name text;
      begin    
        get stacked diagnostics vConstraint_Name = CONSTRAINT_NAME;
        perform error$.raise ('check_violation.' || vConstraint_Name, idb_message := SQLERRM);
      end;
  end;

  oResult := cf$_ie.get (('{"idIE": ' || vCashFlow.Id_CashFlow::text || '}')::jsonb);

  if vNewTags is not null then
    oResult := oResult || concat (',', '"newTags"', ':', '[', vNewTags ,']');
  end if;
end;
$function$
