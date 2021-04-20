CREATE OR REPLACE FUNCTION "cf$_import".zenmoney(iid_file integer, iimport_source_type_code integer, idelimiter text, iisgroup boolean, iid_tag integer, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  -- Максимально кол-во ошибок, переданных клиенту
  vMax_Errors_Count        int := 100;
  vErrors                  text;

  vNLine                   integer;
  vLoaded_Count            integer;
  vErrors_Count            integer;
  r                        record;
  vId_Project              int := context.get('Id_Project')::int;
  vReferences              text;

  vIs_New_Account    boolean := false;
  vIs_New_Category   boolean := false;
  vIs_New_Contractor boolean := false;
  vIs_New_Tag        boolean := false;

  vTags_0            int[];
  vTags              int[];
begin
  vNLine := 0;
  vLoaded_Count := 0;
  vErrors_Count := 0;

  if iId_Tag is null then 
    vTags_0 := '{}';
  else
    vTags_0 := array[iId_Tag];
  end if;

  /*
  1  date,
  2  categoryName
  3  payee
  4  comment
  
  5  outcomeAccountName
  6  outcome
  7  outcomeCurrencyShortTitle
  
  8  incomeAccountName
  9  income
  10 incomeCurrencyShortTitle
  */
  if iImport_Source_Type_Code = 1 
  then
    declare
      vCategory    cf$.Category%rowtype;
      vContractor  cf$.Contractor%rowtype;
      vAccount_Out cf$.Account%rowtype;
      vSum_Out     numeric;
      vMoney_Out   cf$.Money%rowtype;
      vAccount_In  cf$.Account%rowtype;
      vSum_In      numeric;
      vMoney_In    cf$.Money%rowtype;
      vNote                      text;

      vId_CashFlow cf$.CashFlow.Id_CashFlow%type;

      vContractors     hstore;
      vCategories      hstore;
      vAccounts        hstore;
      vMoneys          hstore; 
      
      vIs_Debt         boolean;
      vDebts           hstore := ''::hstore;

      -- Основная сумма долга
      vId_Category_Debt_2  cf$.Category.Id_Category%type := cf$_Category.get_Category_By_Prototype(2);

      -- Перемещение
      vId_Category_Transfer_11  cf$.Category.Id_Category%type := cf$_Category.get_Category_By_Prototype(11);
      vId_Category_Transfer_12  cf$.Category.Id_Category%type := cf$_Category.get_Category_By_Prototype(12);

      -- Обмен
      vId_Category_Exchange_21  cf$.Category.Id_Category%type := cf$_Category.get_Category_By_Prototype(21);
      vId_Category_Exchange_22  cf$.Category.Id_Category%type := cf$_Category.get_Category_By_Prototype(22);

      -- Пустая категория
      vId_Category_Empty        cf$.Category.Id_Category%type := cf$_category.get_Empty_Category();
      
      vCategories_Array         text[];
      --

      vDate                      date;
      vCategoryName              text;
      vPayee                     text;
      vComment                   text;
  
      vOutcomeAccountName        text;
      vOutcome                   numeric;
      vOutcomeCurrencyShortTitle text;
  
      vIncomeAccountName         text;
      vIncome                    numeric;
      vIncomeCurrencyShortTitle  text;
    
    begin
      -- только первый уровень
      select coalesce (hstore (array_agg (upper(c.name) order by c.Id_Category), 
                               array_agg (c.Id_Category::text order by c.Id_Category)), ''::hstore)
        into vCategories 
        from cf$.v_Category c
       where c.Parent is null;

      select coalesce (hstore (array_agg (upper (a.name) order by a.Id_Account), 
                               array_agg (a.Id_Account::text order by a.Id_Account)), ''::hstore)
        into vAccounts
        from cf$.v_Account a;

      select coalesce (hstore (array_agg (upper(c.name) order by c.Id_Contractor), 
                               array_agg(c.Id_Contractor::text order by c.Id_Contractor)), ''::hstore)
        into vContractors
        from cf$.v_Contractor c;

      select coalesce (hstore (array_agg (upper (c.Code) order by m.Id_Money), 
                               array_agg (m.Id_Money::text order by m.Id_Money)), ''::hstore)
        into vMoneys
        from      cf$.v_Money m 
             join cf$.Currency c 
            using (Id_Currency);

      for r in (select lib.csv_to_arrays (core$_File.get_content(iId_File), iDelimiter) as obj) 
      loop
        vNLine := vNLine + 1;
        if vNLine < 5
        then
          continue;
        end if;

        vIs_Debt := false;
        vAccount_Out := null;
        vAccount_In := null;
        vCategory := null;
        vContractor := null;
        vMoney_In := null;
        vMoney_Out := null;

        vId_CashFlow := null;
        vTags := vTags_0;

        if nullif (trim (r.obj[1]), '') is not null 
        then
          begin
            vDate := sanitize$.to_Date (r.obj[1]); 
            vCategoryName := sanitize$.to_String(r.obj[2]);
            vPayee := sanitize$.to_String(r.obj[3]);
            vComment := sanitize$.to_String(r.obj[4]);
        
            vOutcomeAccountName := sanitize$.to_String(r.obj[5]);
            vOutcome := sanitize$.to_Numeric(r.obj[6]);
            vOutcomeCurrencyShortTitle := sanitize$.to_String(r.obj[7]);
        
            vIncomeAccountName := sanitize$.to_String(r.obj[8]);
            vIncome := sanitize$.to_Numeric(r.obj[9]);
            vIncomeCurrencyShortTitle := sanitize$.to_String(r.obj[10]);
            
           
            if vCategoryName is null 
            then
              vCategory.Id_Category := vId_Category_Empty;
            else
              vCategories_Array := string_to_array (vCategoryName, ',');
              
              if array_length (vCategories_Array, 1) > 1 then

                vCategory.Name := trim (vCategories_Array[1]);
                
                -- Остальные категории как теги
                select oTags || vTags
                  into vTags
                  from cf$_tag.decode ((select array (select substring (trim (Tag) for 30) 
                                                        from unnest (array_remove (vCategories_Array, vCategories_Array[1])) as Tag)));
                vIs_New_Tag := true;

              else
                vCategory.name := vCategoryName;
              end if;
            
              vCategory.Id_Category := vCategories->(upper(vCategory.name));

              if vCategory.Id_Category is null 
              then
                vIs_New_Category := true;

                insert into cf$.Category (Name, Parent)
                     values (vCategory.name, null)
                  returning Id_Category
                       into vCategory.Id_Category;
                 vCategories := vCategories || hstore (upper(vCategory.name), vCategory.Id_Category::text);
              end if;
            end if;

            -- Контрагент
            vContractor.name := vPayee;
            if vContractor.name is not null 
            then
              vContractor.Id_Contractor := vContractors->upper(vContractor.name);

              if vContractor.Id_Contractor is null then
                vIs_New_Contractor := true;

                insert into cf$.Contractor (Name)
                     values (vContractor.name)
                  returning Id_Contractor
                       into vContractor.Id_Contractor;
                 vContractors := vContractors || hstore (upper(vContractor.name), vContractor.Id_Contractor::text);
               end if;
            end if;

            vNote := vComment;
            
            -- Счет
            vAccount_Out.name := vOutcomeAccountName;
            if vAccount_Out.name is not null 
            then
              if upper(vAccount_Out.name) = upper('Долги') 
              then
                vIs_Debt := true;
              else
                vAccount_Out.Id_Account := vAccounts->upper(vAccount_Out.name);
                if vAccount_Out.Id_Account is null 
                then
                  vIs_New_Account := true;
                  -- 5 - Другое
                  insert into cf$.Account (Name, Id_Account_Type)
                       values (vAccount_Out.name, 5)
                    returning Id_Account
                         into vAccount_Out.Id_Account;
                   vAccounts := vAccounts || hstore (upper(vAccount_Out.name), vAccount_Out.Id_Account::text);
                end if;
              end if;
            end if;
            
            vSum_Out := vOutcome;
            
            -- Валюта
            vMoney_Out.Id_Money := vMoneys->upper(vOutcomeCurrencyShortTitle);
            
            -- Счет IN
            vAccount_In.name := vIncomeAccountName;
            if vAccount_In.name is not null 
            then
              if upper(vAccount_In.name) = upper('Долги') then
                vIs_Debt := true;
              else
                vAccount_In.Id_Account := vAccounts->upper(vAccount_In.name);
                if vAccount_In.Id_Account is null 
                then
                  vIs_New_Account := true;
                  -- 5 - Другое
                  insert into cf$.Account (Name, Id_Account_Type)
                       values (vAccount_In.name, 5)
                    returning Id_Account
                         into vAccount_In.Id_Account;

                   vAccounts := vAccounts || hstore (upper(vAccount_In.name), vAccount_In.Id_Account::text);
                 end if;
               end if;
            end if;
            
            vSum_In := vIncome;
            
            -- Валюта
            vMoney_In.Id_Money := vMoneys->upper(vIncomeCurrencyShortTitle);

            ----------------------
            
            if vIs_Debt
            then
              -- Объединяем долги по одному контрагенту в один ДП
              vId_CashFlow := vDebts->vContractor.Id_Contractor::text;

              if vId_CashFlow is null 
              then
                insert into cf$.CashFlow (Id_Contractor, Id_CashFlow_Type, Tags)
                     values (vContractor.Id_Contractor, 2, vTags_0)
                  returning Id_CashFlow
                       into vId_CashFlow;
                vDebts := vDebts || hstore (vContractor.Id_Contractor::text, vId_CashFlow::text);
              end if;

              if     vAccount_In.Id_Account is not null 
                 and vAccount_Out.Id_Account is null 
              then
                -- Взял в Долг
                if vMoney_In.Id_Money is null 
                then
                  vErrors_Count := vErrors_Count + 1;
                  if vErrors_Count <= vMax_Errors_Count then
                    vErrors := concat_ws (',', vErrors,
                                          json_build_object ('message', 'Не найдена валюта долга',
                                                             'nLine', vNLine,
                                                             'text', r.obj::text
                                                            ));
                  end if;
                  continue;
                end if;
                
                -- основная сумма долга (2)
                insert into cf$.CashFlow_Detail (Id_CashFlow, 
                                                 Id_Account, 
                                                 Id_Category, 
                                                 Id_Money, 
                                                 Sign, 
                                                 DCashFlow_Detail, 
                                                 Quantity, 
                                                 Sum,
                                                 Note,
                                                 Tags)
                   values (vId_CashFlow, vAccount_In.Id_Account, vId_Category_Debt_2, 
                           vMoney_In.Id_Money, 1, vDate, 1, vSum_In, vNote, vTags);
                
              elsif     vAccount_In.Id_Account is null 
                    and vAccount_Out.Id_Account is not null and vIs_Debt 
              then
                -- Дал в долг
                if vMoney_Out.Id_Money is null 
                then
                  vErrors_Count := vErrors_Count + 1;
                  if vErrors_Count <= vMax_Errors_Count then
                    vErrors := concat_ws (',', vErrors,
                                          json_build_object ('message', 'Не найдена валюта долга',
                                                             'nLine', vNLine,
                                                             'text', r.obj::text
                                                            ));
                  end if;
                  continue;
                end if;
                
                insert into cf$.CashFlow_Detail (Id_CashFlow, 
                                                 Id_Account, 
                                                 Id_Category, 
                                                 Id_Money, 
                                                 Sign, 
                                                 DCashFlow_Detail, 
                                                 Quantity, 
                                                 Sum,
                                                 Note,
                                                 Tags)
                      values (vId_CashFlow, vAccount_Out.Id_Account, vId_Category_Debt_2, 
                              vMoney_Out.Id_Money, -1, vDate, 1, vSum_Out, vNote, vTags);
              else
                perform error$.raise('invalid_file_format');
              end if;
            elsif     vAccount_In.Id_Account is not null 
                  and vAccount_Out.Id_Account is null 
            then 
              -- приход
              if vMoney_In.Id_Money is null 
              then
                vErrors_Count := vErrors_Count + 1;
                if vErrors_Count <= vMax_Errors_Count then
                  vErrors := concat_ws (',', vErrors,
                                        json_build_object ('message', 'Не найдена валюта прихода',
                                                           'nLine', vNLine,
                                                           'text', r.obj::text
                                                          ));
                end if;
                continue;
              end if;

              insert into cf$.CashFlow (Id_Contractor, Id_CashFlow_Type, Tags)
                     values (vContractor.Id_Contractor, 1, vTags_0)
                  returning Id_CashFlow
                       into vId_CashFlow;


              insert into cf$.CashFlow_Detail (Id_CashFlow, 
                                               Id_Account, 
                                               Id_Category, 
                                               Id_Money, 
                                               Sign, 
                                               DCashFlow_Detail, 
                                               Quantity, 
                                               Sum,
                                               Tags, 
                                               Note)
                   values (vId_CashFlow, vAccount_In.Id_Account, vCategory.Id_Category, 
                           vMoney_In.Id_Money, 1, vDate, 1, vSum_In, vTags, vNote);
              
            elsif     vAccount_In.Id_Account is null 
                  and vAccount_Out.Id_Account is not null 
            then 
              -- Расход
              if vMoney_Out.Id_Money is null 
              then
                vErrors_Count := vErrors_Count + 1;
                if vErrors_Count <= vMax_Errors_Count then
                  vErrors := concat_ws (',', vErrors,
                                        json_build_object ('message', 'Не найдена валюта  расхода',
                                                           'nLine', vNLine,
                                                           'text', r.obj::text
                                                          ));
                end if;
                continue;
              end if;
              
              if iIsGroup then
                select cfd.Id_CashFlow
                  into vId_CashFlow
                  from cf$.CashFlow_Detail cfd
                 where cfd.Id_Project = vId_Project
                   and cfd.Id_Account = vAccount_Out.Id_Account
                   and cfd.DCashFlow_Detail = vDate
                   and cfd.Id_Category = vCategory.Id_Category;
              end if;
                  
              if vId_CashFlow is null 
              then
                insert into cf$.CashFlow (Id_Contractor, Id_CashFlow_Type, Tags)
                     values (vContractor.Id_Contractor, 1, vTags_0)
                  returning Id_CashFlow
                       into vId_CashFlow;
               end if;

               insert into cf$.CashFlow_Detail (Id_CashFlow, 
                                                 Id_Account, 
                                                 Id_Category, 
                                                 Id_Money, 
                                                 Sign, 
                                                 DCashFlow_Detail, 
                                                 Quantity, 
                                                 Sum, 
                                                 Tags, 
                                                 Note)
                     values (vId_CashFlow, vAccount_Out.Id_Account, vCategory.Id_Category, 
                             vMoney_Out.Id_Money, -1, vDate, 1, vSum_Out, vTags, vNote);

            elsif     vAccount_In.Id_Account is not null 
                  and vAccount_Out.Id_Account is not null 
            then 
              if    vMoney_In.Id_Money is null 
                 or vMoney_Out.Id_Money is null
              then
                vErrors_Count := vErrors_Count + 1;
                if vErrors_Count <= vMax_Errors_Count then
                  vErrors := concat_ws (',', vErrors,
                                        json_build_object ('message', 'Не найдена валюта перевода/долга',
                                                           'nLine', vNLine,
                                                           'text', r.obj::text
                                                          ));
                end if;
                continue;
              end if;

              if vMoney_In.Id_Money = vMoney_Out.Id_Money 
              then
                -- Перевод
                if vSum_Out < vSum_In then
                  vErrors_Count := vErrors_Count + 1;
                  if vErrors_Count <= vMax_Errors_Count then
                    vErrors := concat_ws (',', vErrors,
                                          json_build_object ('message', 'Сумма прихода больше суммы расхода',
                                                             'nLine', vNLine,
                                                             'text', r.obj::text
                                                            ));
                  end if;
                  continue;
                end if;

                insert into cf$.CashFlow ( Id_CashFlow_Type, Note,Tags)
                     values (3, vNote, vTags_0)
                  returning Id_CashFlow
                       into vId_CashFlow;

                insert into cf$.CashFlow_Detail (Id_CashFlow, 
                                                 Id_Account, 
                                                 Id_Category, 
                                                 Id_Money, 
                                                 Sign, 
                                                 DCashFlow_Detail, 
                                                 Quantity, 
                                                 Sum)
                     values (vId_CashFlow, vAccount_Out.Id_Account, vId_Category_Transfer_11, vMoney_In.Id_Money, -1, vDate, 1, vSum_In),
                            (vId_CashFlow, vAccount_In.Id_Account, vId_Category_Transfer_11, vMoney_In.Id_Money, 1, vDate, 1, vSum_In);

                if  vSum_Out > vSum_In 
                then
                  -- Остальное списываем на комиссию
                  insert into cf$.CashFlow_Detail (Id_CashFlow, 
                                                   Id_Account, 
                                                   Id_Category, 
                                                   Id_Money, 
                                                   Sign, 
                                                   DCashFlow_Detail, 
                                                   Quantity, 
                                                   Sum)
                       values (vId_CashFlow, vAccount_Out.Id_Account, vId_Category_Transfer_12, 
                               vMoney_In.Id_Money, -1, vDate, 1, vSum_Out - vSum_In);
                end if;
              else
                -- Обмен валюты
                insert into cf$.CashFlow (Note, Id_CashFlow_Type, Tags)
                     values (vNote, 4, vTags_0)
                  returning Id_CashFlow
                       into vId_CashFlow;

                insert into cf$.CashFlow_Detail (Id_CashFlow, 
                                                 Id_Account, 
                                                 Id_Category, 
                                                 Id_Money, 
                                                 Sign, 
                                                 DCashFlow_Detail, 
                                                 Quantity, 
                                                 Sum)
                     values (vId_CashFlow, vAccount_Out.Id_Account, vId_Category_Exchange_21, 
                             vMoney_Out.Id_Money, -1, vDate, 1, vSum_Out),
                            (vId_CashFlow, vAccount_In.Id_Account, vId_Category_Exchange_21, 
                             vMoney_In.Id_Money, 1, vDate, 1, vSum_In);
              end if;
            else
              -- Ошибка
              vErrors_Count := vErrors_Count + 1;
              if vErrors_Count <= vMax_Errors_Count 
              then
                vErrors := concat_ws (',', vErrors,
                                      json_build_object ('message', ' Не удалось определить тип операции',
                                                         'nLine', vNLine,
                                                         'text', r.obj::text
                                                        ));
              end if;
              continue;
            end if;

            vLoaded_Count := vLoaded_Count + 1;
          exception
            when others 
            then
              vErrors_Count := vErrors_Count + 1;
              if vErrors_Count <= vMax_Errors_Count 
              then
                declare
                  vMessage varchar;
                begin
                  get stacked diagnostics vMessage = message_text;
                  vErrors := concat_ws (',', vErrors,
                                        json_build_object ('message', vMessage,
                                                           'nLine', vNLine,
                                                           'text', r.obj::text
                                                          ));
                end;
              end if;
          end;  
        end if;
      end loop;
    end;  
  else 
    perform error$.raise ('Invalid import source type''s code');
  end if;

  if vIs_New_Account 
  then
   vReferences := concat_ws (',', vReferences, cf$_account.get ('{}'::jsonb));
  end if;

  if vIs_New_Category 
  then
   vReferences := concat_ws (',', vReferences, cf$_category.get ('{}'::jsonb));
  end if;

  if vIs_New_Contractor 
  then
   vReferences := concat_ws (',', vReferences, cf$_contractor.get ('{}'::jsonb));
  end if;
  
  if vIs_New_Tag 
  then
   vReferences := concat_ws (',', vReferences, cf$_tag.get ('{}'::jsonb));
  end if;

  oResult := concat ('"loadedCount":',  json.to_json(vLoaded_Count), 
                     ',"errorsCount":',  json.to_json(vErrors_Count),
                     ',"errors":[', vErrors, ']'
                     ',"references":{', vReferences, '}'
                    );
                    
end;
$function$
