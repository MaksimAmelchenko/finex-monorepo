CREATE OR REPLACE FUNCTION "cf$_import".homemoney(iid_file integer, iimport_source_type_code integer, idelimiter text, iis_group boolean, iid_tag integer, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vErrors                  text;
  vWarnings                text;
  vNLine                   integer;

  vLoaded_Count            integer;
  vErrors_Count            integer;
  vWarnings_Count          int;

  r                        record;
  vId_Project              int := context.get('Id_Project')::int;
  -- Максимально кол-во ошибок, переданных клиенту
  vMax_Errors_Count        int := 100;
  vReferences              text;

  vIs_New_Money            boolean := false;
  vIs_New_Account          boolean := false;
  vIs_New_Category         boolean := false;
  vIs_New_Tag              boolean := true;

  vTags_0                  cf$.CashFlow_Detail.Tags%type;
  vTags                    cf$.CashFlow_Detail.Tags%type;
  
begin
  vNLine := 0;
  vLoaded_Count := 0;
  vErrors_Count := 0;
  vWarnings_Count := 0;

  if iId_Tag is null 
  then
    vTags_0 := '{}';
  else
    vTags_0 := array[iId_Tag];
  end if;

  if iImport_Source_Type_Code = 1
  then
    -- CSV
    declare
      vCategory        cf$.Category%rowtype;
      vSub_Category    cf$.Category%rowtype;
      vAccount         cf$.Account%rowtype;
      vAccount_In      cf$.Account%rowtype;
      vAccount_Out     cf$.Account%rowtype;
      vMoney           cf$.Money%rowtype;
      vMoney_In        cf$.Money%rowtype;
      vMoney_Out       cf$.Money%rowtype;

      vId_CashFlow   cf$.CashFlow.Id_CashFlow%type;

      vMoneys            hstore;
      vCategories        hstore;
      vAccounts          hstore;

      vIs_Skeep_Next_Line boolean;

      --

      vDate                  date;
      vAccount_Name          text;
      vCategory_Full_Name    text;
      vSum                   numeric;
      vCurrency_Name         text;
      vNote                  text;
      vTransfer_Account_Name text;
      
      vDate_Next                  date;
      vAccount_Name_Next          text;
      vCategory_Full_Name_Next    text;
      vSum_Next                   numeric;
      vCurrency_Name_Next         text;
      vNote_Next                  text;
      vTransfer_Account_Name_Next text;

      vKey              text;
      vCashFlows        hstore := ''::hstore;
      
      vCount            int;
      
      -- Обмен
      vId_Category_Exchange_21  cf$.Category.Id_Category%type := cf$_Category.get_Category_By_Prototype(21);
      -- Перемещение
      vId_Category_Transfer_11  cf$.Category.Id_Category%type := cf$_Category.get_Category_By_Prototype(11);

    begin
      -- для перемещений и обменов в файле двойная запись: расход и приход
      -- Вторую запись нужно пропустить
      vIs_Skeep_Next_Line := false;

      -- !!! Возможно, что несколько денег с один кодом валюты, 
      -- тогда будет сохранена только одна из них
      select coalesce (hstore (array_agg (coalesce (c.Code, m.Name) order by m.Id_Money),
                               array_agg (m.Id_Money::text order by m.Id_Money)), ''::hstore)
        into vMoneys     
        from           cf$.v_Money m 
             left join cf$.Currency c using (Id_Currency);

      select coalesce (hstore (array_agg (coalesce(c.Parent::text, '') || '$$$' || upper(c.name) order by c.Id_Category),
                               array_agg (c.Id_Category::text order by c.Id_Category)), ''::hstore)
        into vCategories
        from cf$.v_Category c;

      -- !!! Если импортируется в существующий проект со счетами, к которым нет доступа
      -- то возможно ситуация, когда при попытки вставить счет, возникнит 
      -- ошибка дублирования
      select coalesce (hstore (array_agg (upper (a.name) order by a.Id_Account),
                               array_agg (a.Id_Account::text order by a.Id_Account)), ''::hstore)
        into vAccounts
        from cf$.v_Account a;
      -- date;account;category;total;currency;description;transfer
      for r in (select obj,
                       lead(obj) over() as obj_Next
                   from lib.csv_to_arrays(core$_File.get_content(iId_File), iDelimiter) as obj
                  where obj != '{""}')
      loop
        begin
          vNLine := vNLine + 1;
          if vNLine = 1 
          then
            continue;
          end if;
          
          if vIs_Skeep_Next_Line
          then
            vIs_Skeep_Next_Line := false;
            continue;
          end if;


          vAccount := null;
          vAccount_Out := null;
          vAccount_In := null;

          vCategory := null;
          vSub_Category := null;

          vMoney := null;
          vMoney_Out := null;
          vMoney_In := null;

          vSum := sanitize$.to_numeric (r.obj[4]);

          if coalesce(vSum, 0) = 0 
          then
            continue;
          end if;

          vDate := sanitize$.to_Date (r.obj[1], 'dd.mm.yyyy');
          vAccount_Name := sanitize$.to_String (r.obj[2]);
          vCategory_Full_Name := sanitize$.to_String (r.obj[3]);

          vCurrency_Name := sanitize$.to_String (r.obj[5]);
          vNote := sanitize$.to_String (r.obj[6]);
          vTransfer_Account_Name := sanitize$.to_String (r.obj[7]);

          vDate_Next := sanitize$.to_Date (r.obj_Next[1], 'dd.mm.yyyy');
          vAccount_Name_Next := sanitize$.to_String (r.obj_Next[2]);
          vCategory_Full_Name_Next := sanitize$.to_String (r.obj_Next[3]);
          vSum_Next := sanitize$.to_numeric (r.obj_Next[4]);
          vCurrency_Name_Next := sanitize$.to_String (r.obj_Next[5]);
          vNote_Next := sanitize$.to_String (r.obj_Next[6]);
          vTransfer_Account_Name_Next := sanitize$.to_String (r.obj_Next[7]);


          if vAccount_Name is null
          then
            vErrors_Count := vErrors_Count + 1;
            if vErrors_Count <= vMax_Errors_Count 
            then
              vErrors := concat_ws (',', vErrors,
                                    json_build_object ('message', 'Не задан счет',
                                                       'nLine', vNLine,
                                                       'text', r.obj::text
                                                      ));
            end if;
            continue;
          end if;

          if vCurrency_Name is null
          then
            vErrors_Count := vErrors_Count + 1;
            if vErrors_Count <= vMax_Errors_Count 
            then
              vErrors := concat_ws (',', vErrors,
                                    json_build_object ('message', 'Не задана валюта',
                                                       'nLine', vNLine,
                                                       'text', r.obj::text
                                                      ));
            end if;
            continue;
          end if;


          vId_CashFlow := null;
          vTags := vTags_0;

          -- Из коментария выцепляем теги и создаем их, пример: 'Покупка #телевизор на *подарок'
          -- TODO переработать регулярное выражение в одно, что бы уйти от union
          -- что-то типа этого: (\#([^\s$]+)|\*([^\s$]+)), но здесь проблема с индексом
          
          select vTags || oTags
            into vTags
            from cf$_tag.decode ((select array (select substring(a[1] for 30)
                                                  from regexp_matches(vNote, '\#([^\s$]+)', 'g') a
                                                 union all  
                                                select substring(a[1] for 30)
                                                  from regexp_matches(vNote, '\*([^\s$]+)', 'g') a
                                                )));

          vAccount.Name := vAccount_Name;
          vAccount.Id_Account := vAccounts->upper(vAccount.Name);
          if vAccount.Id_Account is null
          then
            vIs_New_Account := true;
            insert into cf$.Account (Name, Id_Account_Type)
                 values (vAccount.name, 5)
              returning Id_Account
                   into vAccount.Id_Account;
            vAccounts := vAccounts || hstore (upper(vAccount.name), vAccount.Id_Account::text);
          end if;
            
          vMoney.Name := vCurrency_Name;
          vMoney.Id_Money := vMoneys->upper(vMoney.Name);
          if vMoney.Id_Money is null
          then
            vIs_New_Money := true;
            insert into cf$.Money (Name, Symbol)
                 values (vMoney.Name, vMoney.Name)
              returning Id_Money
                   into vMoney.Id_Money;
                     
            vMoneys := vMoneys || hstore (upper(vMoney.Name), vMoney.Id_Money::text);
          end if;
            
          -- Определяем тип записи (приход/расход, перемещение, обмен)
          -- для обмена и перемещения двойная запись. Первая строка - расход, вторая - приход
          if     vSum_Next is not null 
             and vCategory_Full_Name is null
             and vCategory_Full_Name_Next is null
             and vTransfer_Account_Name is not null
             and vTransfer_Account_Name_Next is not null
          then
            vIs_Skeep_Next_Line := true;
              
            vAccount_Out.Id_Account := vAccount.Id_Account;
            vMoney_Out.Id_Money := vMoney.Id_Money;
              
            vAccount_In.Name := vTransfer_Account_Name;
            vAccount_In.Id_Account := vAccounts->upper(vAccount_In.Name);
            if vAccount_In.Id_Account is null
            then
              vIs_New_Account := true;
              insert into cf$.Account (Name, Id_Account_Type)
                   values (vAccount_In.Name, 5)
                returning Id_Account
                     into vAccount_In.Id_Account;
              vAccounts := vAccounts || hstore (upper(vAccount_In.name), vAccount_In.Id_Account::text);
            end if;

            vMoney_In.Name := vCurrency_Name_Next;
            vMoney_In.Id_Money := vMoneys->upper(vMoney_In.Name);
            if vMoney_In.Id_Money is null
            then
              vIs_New_Money := true;
              insert into cf$.Money (Name, Symbol)
                   values (vMoney_In.Name, vMoney_In.Name)
                returning Id_Money
                     into vMoney_In.Id_Money;
                       
                vMoneys := vMoneys || hstore (upper(vMoney_In.Name), vMoney_In.Id_Money::text);
            end if;
              
            --
              
            if vMoney_In.Id_Money != vMoney_Out.Id_Money
            then
              -- Обмен валюты
              insert into cf$.CashFlow (Id_CashFlow_Type, Note, Tags)
                   values (4, vNote, vTags)
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
                           vMoney_Out.Id_Money, -1, vDate, 1, -vSum),
                          (vId_CashFlow, vAccount_In.Id_Account, vId_Category_Exchange_21, 
                           vMoney_In.Id_Money, 1, vDate, 1, vSum_Next);
              vLoaded_Count := vLoaded_Count + 2;
              continue;
            else
              -- Перевод
              if vSum != - vSum_Next 
              then
                vErrors_Count := vErrors_Count + 1;
                if vErrors_Count <= vMax_Errors_Count 
                then
                  vErrors := concat_ws (',', vErrors,
                                        json_build_object ('message', 'При переводе сумма перевода не должна меняться',
                                                           'nLine', vNLine,
                                                           'text', r.obj::text || '</br>' || r.obj_next::text
                                                          ));
                end if;
                continue;
              end if;
  
              insert into cf$.CashFlow (Id_CashFlow_Type, Note, Tags)
                   values (3, vNote, vTags)
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
                   values (vId_CashFlow, vAccount_Out.Id_Account, vId_Category_Transfer_11, 
                           vMoney_Out.Id_Money, -1, vDate, 1, -vSum),
                          (vId_CashFlow, vAccount_In.Id_Account, vId_Category_Transfer_11, 
                           vMoney_In.Id_Money, 1, vDate, 1, vSum_Next);
              vLoaded_Count := vLoaded_Count + 2;
              continue;
            end if;
          end if;    
              
          -- Обычный приход/расход
          if vCategory_Full_Name is null
          then
            vErrors_Count := vErrors_Count + 1;
            if vErrors_Count <= vMax_Errors_Count 
            then
              vErrors := concat_ws (',', vErrors,
                                    json_build_object ('message', 'Не задана категория',
                                                       'nLine', vNLine,
                                                       'text', r.obj::text
                                                      ));
            end if;
            continue;
          end if;
            
          --Категория !!!!!!
          select trim(c[1]),
                 trim(c[2])
           into vCategory.Name,
                vSub_Category.Name
           from string_to_array(vCategory_Full_Name, '\') c;
          
          vKey := '$$$' || upper(vCategory.Name);
          vCategory.Id_Category := vCategories->vKey;
          if vCategory.Id_Category is null
          then
            vIs_New_Category := true;

            insert into cf$.Category (Name, Parent)
                 values (vCategory.name, null)
              returning Id_Category
                   into vCategory.Id_Category;

            vCategories := vCategories || hstore (vKey, vCategory.Id_Category::text);
          end if;
          
          if vSub_Category.Name is not null 
          then
            -- Есть подкатегория
            vKey := vCategory.Id_Category || '$$$' || upper(vSub_Category.Name);
            vSub_Category.Id_Category := vCategories->vKey;
            if vSub_Category.Id_Category is null
            then
              vIs_New_Category := true;

              insert into cf$.Category (Name, Parent)
                   values (vSub_Category.name, vCategory.Id_Category)
                returning Id_Category
                     into vSub_Category.Id_Category;

              vCategories := vCategories || hstore (vKey, vSub_Category.Id_Category::text);
            end if;
            vCategory.Id_Category := vSub_Category.Id_Category;
          end if;
            
          if vSum > 0 
          then
            -- приход
            insert into cf$.CashFlow (Id_CashFlow_Type, Note, Tags)
                 values (1, vNote, vTags_0)
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
                 values (vId_CashFlow, vAccount.Id_Account, vCategory.Id_Category, 
                         vMoney.Id_Money, 1, vDate, 1, vSum, vTags, vNote);
          else
            -- Расход
            if iIs_Group 
            then
              -- 2010-12-30$1234$5678
              -- в один день, по одному счету и по одной категории за один день
              vKey := concat_ws('$$$', r.obj[1], vAccount.Id_Account, vCategory.Id_Category);
              vId_CashFlow := vCashFlows->vKey;
            end if;

            if vId_CashFlow is null 
            then
              insert into cf$.CashFlow (Id_CashFlow_Type, Note, Tags)
                   values (1, vNote, vTags_0)
                returning Id_CashFlow
                     into vId_CashFlow;

              if iIs_Group 
              then
                vCashFlows := vCashFlows || hstore (vKey, vId_CashFlow::text);
              end if;
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
                 values (vId_CashFlow, vAccount.Id_Account, vCategory.Id_Category, 
                         vMoney.Id_Money, -1, vDate, 1, -vSum, vTags, vNote);
          end if;
          vLoaded_Count := vLoaded_Count + 1;
        exception
          when others 
          then
            vErrors_Count := vErrors_Count + 1;
            if vErrors_Count <= vMax_Errors_Count 
            then
              declare
                vMessage text;
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
      end loop;
    end;
  else
    perform error$.raise ('internal_server_error', iMessage := 'Invalid import source type''s code');
  end if;

  if vIs_New_Money
  then
    vReferences := concat_ws (',', vReferences, cf$_money.get ('{}'::jsonb));
  end if;

  if vIs_New_Account 
  then
    vReferences := concat_ws (',', vReferences, cf$_account.get ('{}'::jsonb));
  end if;

  if vIs_New_Category
  then
    vReferences := concat_ws (',', vReferences, cf$_category.get ('{}'::jsonb));
  end if;

  if vIs_New_Tag 
  then
    vReferences := concat_ws (',', vReferences, cf$_tag.get ('{}'::jsonb));
  end if;

  oResult := concat ('"loadedCount":',  json.to_json(vLoaded_Count),
                     ',"errorsCount":',  json.to_json(vErrors_Count),
                     ',"warningsCount":',  json.to_json(vWarnings_Count),
                     ',"errors":[', vErrors, ']'
                     ',"warnings":[', vWarnings, ']'
                     ',"references":{', vReferences, '}'
                    );

end;
$function$
