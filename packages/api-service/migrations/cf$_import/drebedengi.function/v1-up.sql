CREATE OR REPLACE FUNCTION "cf$_import".drebedengi(iid_file integer, iimport_source_type_code integer, idelimiter text, iis_group boolean, iid_tag integer, iis_convert_debts boolean, iis_convert_invalid_debts boolean, OUT oresult text)
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
  vIs_New_Contractor       boolean := false;
  vIs_New_Tag              boolean := true;

  vTags_0                  cf$.CashFlow_Detail.Tags%type;
  vTags                    cf$.CashFlow_Detail.Tags%type;
  
--  vTime timestamptz := clock_timestamp();
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

  if iImport_Source_Type_Code = 2 
  then
    -- Расширенный формат
    declare
      vCategory      cf$.Category%rowtype;
      vContractor    cf$.Contractor%rowtype;
      vAccount       cf$.Account%rowtype;
      vAccount_In    cf$.Account%rowtype;
      vAccount_Out   cf$.Account%rowtype;
      vMoney         cf$.Money%rowtype;
      vMoney_In      cf$.Money%rowtype;
      vMoney_Out     cf$.Money%rowtype;

      vId_CashFlow   cf$.CashFlow.Id_CashFlow%type;

      vMoney_Map        hstore := ''::hstore;
      vCategory_Map     hstore := ''::hstore;
      vAccount_Map      hstore := ''::hstore;
      vContractor_Map   hstore := ''::hstore;

      vContractors       hstore;
      vCategories        hstore;
      vAccounts          hstore;
      vMoneys            hstore;

      vIs_Skeep_Next_Line boolean;
      vMode               int;

      --
      vCode           text;
      --
      vId             int;
      vParent         int;
      vType           int;
      vName           text;
      vIs_Credit_Card boolean;
      vIs_Enabled     boolean;

      --
      vSum         numeric;
      vId_Currency int;
      vId_Object   int;
      vId_Account  int;
      vDate        date;
      vNote        text;
      vId_Group    int;

      vSum_Next         numeric;
      vId_Currency_Next int;
      vId_Object_Next   int;
      vId_Account_Next  int;
      vDate_Next        date;
      vId_Group_Next    int;
      vGroups           hstore := ''::hstore;
      
      vKey              text;
      vCashFlows        hstore := ''::hstore;
      
      vCount            int;
      
      vId_Account_Type   cf$.Account_Type.Id_Account_Type%type;

      -- Обмен
      vId_Category_Exchange_21  cf$.Category.Id_Category%type := cf$_Category.get_Category_By_Prototype(21);
      -- Основная сумма долга
      vId_Category_Debt_2       cf$.Category.Id_Category%type := cf$_Category.get_Category_By_Prototype(2);
      -- Перемещение
      vId_Category_Transfer_11  cf$.Category.Id_Category%type := cf$_Category.get_Category_By_Prototype(11);
      -- Выравневание баланса
      vId_Category_UpToDate_200  cf$.Category.Id_Category%type := cf$_Category.get_Category_By_Prototype(200);

      vCurrency  cf$.Currency%rowtype;
    begin
      -- для перемещений, долгов, обменов в файле двойная запись (приход и расход).
      -- Вторую запись нужно пропустить.
      vIs_Skeep_Next_Line := false;

      select coalesce (hstore (array_agg (coalesce(c.Parent::text, '') || '$$$' || upper(c.name) order by c.Id_Category),
                               array_agg (c.Id_Category::text order by c.Id_Category)), ''::hstore)
        into vCategories
        from cf$.v_Category c;

      -- Для получения родителя по категории (для группировки расходов в ДП
--      if vIs_Group
--      then
--        select coalesce (hstore (array_agg (c.Id_Category::text order by c.Id_Category),
--                                 array_agg (c.Parent::text      order by c.Id_Category)), ''::hstore)
--          into vCategories_Parent
--          from cf$.v_Category c
--         where c.Parent is not null;
--      end if;

      select coalesce (hstore (array_agg (coalesce (c.Code, m.Name) order by m.Id_Money),
                               array_agg (m.Id_Money::text order by m.Id_Money)), ''::hstore)
        into vMoneys     
        from           cf$.v_Money m 
             left join cf$.Currency c using (Id_Currency);

      select coalesce (hstore (array_agg (upper (a.name) order by a.Id_Account),
                               array_agg (a.Id_Account::text order by a.Id_Account)), ''::hstore)
        into vAccounts
        from cf$.v_Account a;

      select coalesce (hstore (array_agg (upper(c.name) order by c.Id_Contractor),
                               array_agg(c.Id_Contractor::text order by c.Id_Contractor)), ''::hstore)
        into vContractors
        from cf$.v_Contractor c;

      for r in (select obj,
                       lead(obj) over() as obj_Next
                   from lib.csv_to_arrays(core$_File.get_content(iId_File), iDelimiter) as obj
                  where obj != '{""}')
      loop
        begin
          vNLine := vNLine + 1;
          
--          if vLoaded_Count > 5000 
--          then
--            exit;
--          end if;
 
          if vIs_Skeep_Next_Line
          then
            vIs_Skeep_Next_Line := false;
            continue;
          end if;

          if r.obj[1] = '[currency]'
          then
            vMode := 1;
            continue;
          elsif r.obj[1] = '[objects]'
          then
            vMode := 2;
            continue;
          elsif r.obj[1] = '[records]'
          then
            vMode := 3;
            if vErrors_Count > 0
            then
              exit;
            end if;
            continue;
          end if;

          if vMode = 1
          then
            -- Раздела "Валюты"
            -- Заполняем перекодировочную таблицу валют, что бы по коду валюты из
            -- дребеденег получить наш код
            vCode := upper (sanitize$.to_String (r.obj[4]));

            if vCode is null
            then
              vErrors_Count := vErrors_Count + 1;
              vErrors := concat_ws (',', vErrors,
                        json_build_object ('message', 'Не задан код валюты',
                                           'nLine', vNLine,
                                           'text', r.obj::text
                                          ));
              continue;
            end if;

            vMoney.Id_Money := vMoneys->vCode; 

            if vMoney.Id_Money is null
            then
              vIs_New_Money := true;

              select c.*
                into vCurrency
                from cf$.Currency c
               where c.code = vCode;
                
                
              insert into cf$.Money (Id_Currency, Name, Symbol)
                   values (vCurrency.Id_Currency, 
                           coalesce (vCurrency.Name, vCode), 
                           coalesce (vCurrency.Symbol, vCode))
                returning Id_Money
                     into vMoney.Id_Money;
                       
              vMoneys := vMoneys || hstore (upper(vCode), vMoney.Id_Money::text);
            end if;

            vMoney_Map := vMoney_Map || hstore (r.obj[1], vMoney.Id_Money::text);
          elsif vMode = 2
          then
            -- Раздел "Объекты"
            -- источник дохода, категории расхода, счета, должники
            vId := r.obj[1]::int;
            vParent := r.obj[2]::int;
            vType := r.obj[3]::int;
            vName := sanitize$.to_String (r.obj[4]);
            if vName is null
            then
              vErrors_Count := vErrors_Count + 1;
              vErrors := concat_ws (',', vErrors,
                        json_build_object ('message', 'Не задано наименование объекта',
                                           'nLine', vNLine,
                                           'text', r.obj::text
                                          ));
              continue;
            end if;

            vIs_Enabled := not (r.obj[7]::boolean);

            if vType in (2, 3)
            then
              -- источник дохода и катогория затрат
              vCategory.name := vName;
              vCategory.Parent := vCategory_Map->vParent::text;
              vKey := coalesce (vCategory.Parent::text, '') || '$$$' || upper(vCategory.name);
              vCategory.Id_Category := vCategories->(vKey);

              if vCategory.Id_Category is null
              then
                vIs_New_Category := true;

                insert into cf$.Category (Name, Parent, Is_Enabled)
                     values (vCategory.name, vCategory.Parent, vIs_Enabled)
                  returning Id_Category
                       into vCategory.Id_Category;

                -- Добавлять в vCategories нет смысла, т.к. записи в исходном файле - уникальные
                -- Оказывается есть смысл, категории НЕУНИКАЛЬНЫЕ
                vCategories := vCategories || hstore (vKey, vCategory.Id_Category::text);
              end if;

              vCategory_Map := vCategory_Map || hstore (vId::text, vCategory.Id_Category::text);
            elsif vType = 4
            then
              if r.obj[8]::boolean
              then
                -- долговый счет
                vId_Account_Type := 7;
              elsif vIs_Credit_Card
              then
                vId_Account_Type := 6;
              else
                -- 5 - Другое
                vId_Account_Type := 5;
              end if;
              
              vAccount.Name := vName;
              vIs_Credit_Card := r.obj[6]::boolean;
              vAccount.Id_Account := vAccounts->upper(vAccount.Name);

              if vAccount.Id_Account is null
              then
                vIs_New_Account := true;
                insert into cf$.Account (Name, Id_Account_Type, Is_Enabled)
                     values (vAccount.name, vId_Account_Type, vIs_Enabled)
                  returning Id_Account
                       into vAccount.Id_Account;
              end if;
              vAccount_Map := vAccount_Map || hstore (vId::text, vAccount.Id_Account::text);
            else
              vErrors_Count := vErrors_Count + 1;
              if vErrors_Count <= vMax_Errors_Count
              then
                vErrors := concat_ws (',', vErrors,
                          json_build_object ('message', 'Неверно задан тип объекта: ' || vObject_Type,
                                             'nLine', vNLine,
                                             'text', r.obj::text
                                            ));
              end if;
              continue;
            end if;
          elsif vMode = 3 
          then
            vAccount := null;
            vAccount_Out := null;
            vAccount_In := null;

            vCategory := null;
            vContractor := null;

            vMoney := null;
            vMoney_In := null;
            vMoney_Out := null;

            vSum := round (sanitize$.to_numeric (r.obj[1]) / 100, 2);

            if coalesce(vSum, 0) = 0 
            then
              continue;
            end if;

            vId_Currency := r.obj[2]::int;
            vId_Object := r.obj[3]::int;
            vId_Account := r.obj[4]::int;
            vDate := sanitize$.to_Date (r.obj[5]);
            vNote := sanitize$.to_String (r.obj[6]);
            vId_Group := nullif(r.obj[8], '')::int;

            vSum_Next := round (sanitize$.to_numeric (r.obj_next[1]) / 100, 2);
            vId_Currency_Next := r.obj_next[2]::int;
            vId_Object_Next := r.obj_next[3]::int;
            vId_Account_Next := r.obj_next[4]::int;
            vDate_Next := sanitize$.to_Date (r.obj_next[5]);

            vId_CashFlow := null;
            vTags := vTags_0;

            -- Из коментария выцепляем теги и создаем их, пример: 'Покупка [телевизор] на [подарок]'
            select vTags || oTags
              into vTags
              from cf$_tag.decode ((select array (select substring(a[1] for 30)
                                                    from regexp_matches(vNote, '\[([^\]]+)\]', 'g') a)));

            -- Определяем тип записи (приход/расход, перемещение, обмен)
            -- для этих операций двойная запись. Первая строка - приход, вторая - расход
            -- Сумма с разными знаками и все 4 счета равны

            if     vSum_Next is not null 
            --   and vSum > 0
               and vId_Object = vId_Account 
               and vId_Account = vId_Object_Next 
               and vId_Object_Next = vId_Account_Next 
               and sign (vSum * vSum_Next) = -1
            then
              -- Обмен валюты
              vIs_Skeep_Next_Line := true;

              -- в дребеденьгах обмен только в пределах одного счета
              vAccount.Id_Account := vAccount_Map->vId_Account::text;
              if vSum > 0 
              then
                vMoney_In.Id_Money := vMoney_Map->vId_Currency::text;
                vMoney_Out.Id_Money := vMoney_Map->vId_Currency_Next::text;
              else
                vMoney_In.Id_Money := vMoney_Map->vId_Currency_Next::text;
                vMoney_Out.Id_Money := vMoney_Map->vId_Currency::text;
              end if;

              if vMoney_In.Id_Money = vMoney_Out.Id_Money 
              then
                vErrors_Count := vErrors_Count + 1;
                if vErrors_Count <= vMax_Errors_Count 
                then
                  vErrors := concat_ws (',', vErrors,
                                        json_build_object ('message', 'Валюта продажи и валюта покупки не могут быть одинаковыми',
                                                           'nLine', vNLine,
                                                           'text', r.obj::text || '</br>' || r.obj_next::text
                                                          ));
                end if;
                continue;
              end if;

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
                   values (vId_CashFlow, vAccount.Id_Account, vId_Category_Exchange_21, 
                           vMoney_Out.Id_Money, -1, vDate, 1, 
                           case when vSum < 0 then abs(vSum) else abs(vSum_Next) end),
                          (vId_CashFlow, vAccount.Id_Account, vId_Category_Exchange_21, 
                           vMoney_In.Id_Money, 1, vDate, 1, 
                           case when vSum > 0 then vSum else vSum_Next end);
              vLoaded_Count := vLoaded_Count + 1;
              continue;
            end if;
              
            -- Первая строка - приход\?\?\?
            -- Уже нет, попадаются перемещения, где первая строка отрицательная

            -- Сумма двух записей отличается только знаком и даты равны, значит это либо перемещение, либо долг
            if     vSum_Next is not null 
--               and vSum > 0
               and vSum = -vSum_Next 
               and vDate = vDate_Next
               and vId_Currency = vId_Currency_Next
               and vId_Account = vId_Object_Next
               and vId_Object = vId_Account_Next
            then
              vIs_Skeep_Next_Line := true;

              vMoney.Id_Money := vMoney_Map->vId_Currency::text;

              if vSum > 0 
              then
                vAccount_Out.Id_Account := vAccount_Map->vId_Object::text;
                vAccount_In.Id_Account := vAccount_Map->vId_Account::text;
              else
                vAccount_Out.Id_Account := vAccount_Map->vId_Account::text;
                vAccount_In.Id_Account := vAccount_Map->vId_Object::text;
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
                           vMoney.Id_Money, -1, vDate, 1, abs(vSum)),
                          (vId_CashFlow, vAccount_In.Id_Account, vId_Category_Transfer_11, 
                           vMoney.Id_Money, 1, vDate, 1, abs(vSum));
              vLoaded_Count := vLoaded_Count + 1;
              continue;
            end if;
            
            -- \?\?\?\? Баг в формате, перемещения могут быть одной строкой
            -- Часть перемещение сделано двойной записью, часть - одной
            -- Да, это баг. Вторая запись существует, только не попорядку
/*            if 1=0
               and    (vAccount_Map->vId_Object::text) is not null
               and (vAccount_Map->vId_Account::text) is not null
            then
              if vSum > 0 
              then
                vAccount_Out.Id_Account := vAccount_Map->vId_Object::text;
                vAccount_In.Id_Account := vAccount_Map->vId_Account::text;
              else
                vAccount_In.Id_Account := vAccount_Map->vId_Object::text;
                vAccount_Out.Id_Account := vAccount_Map->vId_Account::text;
              end if;
              vMoney.Id_Money := vMoney_Map->vId_Currency::text;

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
                           vMoney.Id_Money, -1, vDate, 1, abs(vSum)),
                          (vId_CashFlow, vAccount_In.Id_Account, vId_Category_Transfer_11, 
                           vMoney.Id_Money, 1, vDate, 1, abs(vSum));

              vLoaded_Count := vLoaded_Count + 1;
              continue;
            end if;
*/            
            -- Обычный приход/расход
            vMoney.Id_Money := vMoney_Map->vId_Currency::text;
            
            if vId_Object = -1 
            then
              -- Начальный остаток
              if vId_Category_UpToDate_200 is null 
              then
                insert into cf$.Category (name, Parent, Id_Category_Prototype)
                     select cp.Name, null, cp.Id_Category_Prototype
                       from cf$.Category_Prototype cp
                      where cp.Id_Category_Prototype = 200
                  returning Id_Category
                       into vId_Category_UpToDate_200;
              end if;
              vCategory.Id_Category := vId_Category_UpToDate_200;
            else
              vCategory.Id_Category := vCategory_Map->vId_Object::text;
            end if;

            vAccount.Id_Account := vAccount_Map->vId_Account::text;

            if vSum > 0 
            then
              -- приход
              if vId_Group is not null 
              then
                vId_CashFlow := vGroups->vId_Group::text;
              end if;

              if vId_CashFlow is null 
              then
                insert into cf$.CashFlow (Id_CashFlow_Type, Note, Tags)
                     values (1, vNote, vTags_0)
                  returning Id_CashFlow
                       into vId_CashFlow;
                
                if vId_Group is not null 
                then
                  vGroups := vGroups || hstore (vId_Group::text, vId_CashFlow::text);
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
                           vMoney.Id_Money, 1, vDate, 1, vSum, vTags, vNote);
            else
              -- Расход
              if vId_Group is not null 
              then
                vId_CashFlow := vGroups->vId_Group::text;
              else
                if iIs_Group 
                then
                  -- 2010-12-30$1234$5678
                  -- в один день, по одному счету и по одной категории за один день
                  vKey := concat_ws('$', r.obj[5], vAccount.Id_Account, vCategory.Id_Category);
                  vId_CashFlow := vCashFlows->vKey;
                end if;
              end if;

              if vId_CashFlow is null 
              then
                insert into cf$.CashFlow (Id_CashFlow_Type, Note, Tags)
                     values (1, vNote, vTags_0)
                  returning Id_CashFlow
                       into vId_CashFlow;

                if vId_Group is not null 
                then
                  vGroups := vGroups || hstore (vId_Group::text, vId_CashFlow::text);
                else
                  if iIs_Group 
                  then
                    vCashFlows := vCashFlows || hstore (vKey, vId_CashFlow::text);
                  end if;
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
          else
            perform error$.raise ('internal_server_error', iMessage := 'Invalid mode');
          end if;

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
      
      -- Конвертация долгового счета в долг
--      vTime := lib.console_log ('begin', vTime);
 
      if iIs_Convert_Debts
      then
        for r in (select a.Id_Account,
                         a.Name
                    from cf$.v_Account a
                   where a.Id_Account_Type = 7)
        loop
--         raise  notice 'idProject=%,idAccount=%', vId_Project, r.Id_Account;
        
          -- Есть ли обычные приходы и расходы по долговому счету
          select count(*)
            into vCount
            from      cf$.CashFlow_Detail cfd  
                 join cf$.CashFlow cf using (Id_Project, Id_CashFlow)
           where cfd.Id_Project = vId_Project
             and cfd.Id_Account = r.Id_Account
             and cf.Id_CashFlow_Type = 1;
             
--          vTime := lib.console_log ('1', vTime);

          if vCount > 0
          then
            if not iIs_Convert_Invalid_Debts
            then
              vWarnings_Count := vWarnings_Count + 1;
              vWarnings := concat_ws (',', vWarnings,
                                    json_build_object ('message', 'Долговой счет "' ||  r.Name || '"' ||
                                                                  ' <strong>не заменен</strong> на долг, так как по нему есть приходные или расходные операции',
                                                       'nLine', '',
                                                       'text', ''
                                                      ));
              continue;
            else
                vWarnings_Count := vWarnings_Count + 1;
                vWarnings := concat_ws (',', vWarnings,
                                      json_build_object ('message', 'Долговой счет "' ||  r.Name || '"' ||
                                                                    ' только <strong>частично</strong> заменен на долг, так как по нему есть приходные или расходные операции',
                                                         'nLine', '',
                                                         'text', ''
                                                        ));
            end if;
          end if;
        
          -- проверка, что бы не было обмена валюты на долговом счете
          select count(*)
            into vCount
            from      cf$.CashFlow cf 
                 join cf$.CashFlow_Detail cfd using (Id_Project, Id_CashFlow)
           where cf.Id_Project = vId_Project
             and cf.Id_CashFlow_Type = 4
             and cfd.Id_Account = r.Id_Account;
--          vTime := lib.console_log ('2', vTime);
             
          if vCount > 0
          then
            vErrors_Count := vErrors_Count + 1;
            vErrors := concat_ws (',', vErrors,
                                  json_build_object ('message', 'Замена долгового счета "' ||  r.Name || '"' ||
                                                                ' на долг невозможна, так как есть конвертация валют по данному счету',
                                                     'nLine', '',
                                                     'text', ''
                                                    ));
            continue;                                                    
          end if;        
        
          vContractor.Name := r.Name;
          vContractor.Id_Contractor := vContractors->upper(vContractor.Name);

          if vContractor.Id_Contractor is null
          then
            vIs_New_Contractor := true;
            insert into cf$.Contractor (Name)
                 values (vContractor.name)
              returning Id_Contractor
                   into vContractor.Id_Contractor;
          end if;
--          vTime := lib.console_log ('3', vTime);

          insert into cf$.CashFlow (Id_Contractor, Id_CashFlow_Type, Tags)
               values (vContractor.Id_Contractor,  2, vTags_0)
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
                                           Note,
                                           Tags)
               -- Перемещение по долговому счету
               -- берем вторую часть перемещения, которая касается реального счета
               with a as (select distinct cfd.Id_Project, 
                                          cfd.Id_CashFlow
                            from      cf$.CashFlow_Detail cfd
                                 join cf$.CashFlow cf
                                   on (    cf.Id_Project = cfd.Id_Project 
                                       and cf.Id_CashFlow = cfd.Id_CashFlow)
                           where cfd.Id_Project = vId_Project
                             and cfd.Id_Account = r.Id_Account
                             and cf.Id_CashFlow_Type = 3)
               select vId_CashFlow, 
                      cfd.Id_Account,
                      vId_Category_Debt_2,
                      cfd.Id_Money,
                      cfd.Sign,
                      cfd.DCashFlow_Detail,
                      1,
                      cfd.Sum,
                      cf.Note,
                      cf.Tags
                 from      a
                      join cf$.CashFlow cf 
                        on (    cf.Id_Project = a.Id_Project
                            and cf.Id_CashFlow = a.Id_CashFlow)
                      join cf$.CashFlow_Detail cfd  
                        on (     cfd.Id_Project = cf.Id_Project
                            and  cfd.Id_CashFlow = cf.Id_CashFlow)
                where cfd.Id_Account != r.Id_Account;
          
--          vTime := lib.console_log ('insert ' || r.Name, vTime);

          -- Удаление перемещений по долговому счету
          with a as (select distinct cfd.Id_Project,
                                     cfd.Id_CashFlow
                       from      cf$.CashFlow_Detail cfd
                            join cf$.CashFlow cf using (Id_Project, Id_CashFlow)
                     where cfd.Id_Project = vId_Project
                       and cfd.Id_Account = r.Id_Account
                       and cf.Id_CashFlow_Type = 3)
          delete from cf$.CashFlow_Detail cfd  
                using a
                where cfd.Id_Project = a.Id_Project
                  and cfd.Id_CashFlow = a.Id_CashFlow;

--          vTime := lib.console_log ('delete transfer details '  || r.Name, vTime);
        

          -- Удаление пустых перемещений и долгов
          with a as (select cf.Id_Project,
                            cf.Id_CashFlow
                       from           cf$.CashFlow cf
                            left join cf$.CashFlow_Detail cfd using (Id_Project, Id_CashFlow)
                     where cf.Id_Project = vId_Project
                       and cf.Id_CashFlow_Type in (2,3)
                       and cfd.Id_CashFlow_Detail is null)
          delete from cf$.CashFlow cf
                using a
                where cf.Id_Project = a.Id_Project
                  and cf.Id_CashFlow = a.Id_CashFlow;

--          vTime := lib.console_log ('delete empty transfers ' || r.Name, vTime);

          -- Удаляем долговой счет, если нет движений по нему
          delete from cf$.Account a
                where a.Id_Project = vId_Project
                  and a.id_Account = r.Id_Account
                  and not exists (select null 
                                    from cf$.CashFlow_Detail cfd
                                   where cfd.Id_Project = a.Id_Project
                                     and cfd.Id_Account = a.Id_Account
                                   limit 1);
--          vTime := lib.console_log ('delete empry account ' || r.Name, vTime);
             
        end loop;
      end if;
      
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
                     ',"warningsCount":',  json.to_json(vWarnings_Count),
                     ',"errors":[', vErrors, ']'
                     ',"warnings":[', vWarnings, ']'
                     ',"references":{', vReferences, '}'
                    );

end;
$function$
