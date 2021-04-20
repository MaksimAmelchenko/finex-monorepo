CREATE OR REPLACE FUNCTION "cf$_import".homebuh5(iid_file integer, iimport_source_type_code integer, idelimiter text, iisgroup boolean, iid_tag integer, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vErrors                  text;
  vNLine                   integer;
  vLoaded_Count            integer;
  vErrors_Count            integer;
  r                        record;
  vId_Project              int := context.get('Id_Project')::int;
  -- Максимально кол-во ошибок, переданных клиенту
  vMax_Errors_Count        int := 100;
  vReferences              text;

  vIs_New_Account          boolean := false;
  vIs_New_Category         boolean := false;
  vIs_New_Contractor       boolean := false;
  vIs_New_Unit             boolean := false;
  vIs_New_Tag              boolean := false;
  vId_Tag                  cf$.Tag.Id_Tag%type;

  vTags                    cf$.Cashflow_Detail.Tags%type;
  vTags_0                  cf$.Cashflow_Detail.Tags%type;
  
  vId_Money_Rub    cf$.Money.Id_Money%type := cf$_money.get_Money_By_Currency(643);
  vId_Money_Euro   cf$.Money.Id_Money%type := cf$_money.get_Money_By_Currency(978);
  vId_Money_Dollar cf$.Money.Id_Money%type := cf$_money.get_Money_By_Currency(840);
begin
  vNLine := 0;
  vLoaded_Count := 0;
  vErrors_Count := 0;

  if iId_Tag is null then 
    vTags_0 := '{}';
  else
    vTags_0 := array[iId_Tag];
  end if;
  
  vTags := vTags_0;
  
  -- Расход и приход
  if iImport_Source_Type_Code in (1, 2) 
  then
    declare
      vIndex_Date         integer;
      vIndex_Account      integer;
      vIndex_Category     integer;
      vIndex_Sub_Category integer;
      vIndex_Quantity     integer;
      vIndex_Unit         integer;
      vIndex_Rub          integer;
      vIndex_Euro         integer;
      vIndex_Dollar       integer;
      vIndex_Note         integer;
        
      vUnit                    cf$.Unit%rowtype;
      vCategory                cf$.v_Category%rowtype;
      vCategory_Parent         cf$.v_Category%rowtype;

      vAccount                 cf$.Account%rowtype;
      vDCashFlow_Detail        cf$.CashFlow_Detail.DCashFlow_Detail%type;
      vId_Money                cf$.Money.Id_Money%type;

      vId_CashFlow             cf$.CashFlow.Id_CashFlow%type;
      vSum                     cf$.CashFlow_Detail.sum%type;

      vUnits       hstore;
      vCategories  hstore;
      vAccounts    hstore;
      
      vCashFlow    hstore := ''::hstore;
      vKey         text;
      
    begin
      select coalesce (hstore (array_agg (upper (u.name) order by u.Id_Unit), 
                               array_agg (u.Id_Unit::text order by u.Id_Unit)), ''::hstore)
        into vUnits
        from cf$.v_Unit u;

      select coalesce (hstore (array_agg (coalesce(c.Parent::text, '') || '$$$' || upper(c.name) order by c.Id_Category), 
                               array_agg (c.Id_Category::text order by c.Id_Category)), ''::hstore)
        into vCategories 
        from cf$.v_Category c;

      select coalesce (hstore (array_agg (upper(a.name) order by a.Id_Account), 
                               array_agg (a.Id_Account::text order by a.Id_Account)), ''::hstore)
        into vAccounts
        from cf$.v_Account a;


      --for r in (select json.csv_to_jsonb(core$_File.get_content(iId_File), iDelimiter) as obj) 
      for r in (select lib.csv_to_arrays (core$_File.get_content(iId_File), iDelimiter) as obj) 
      loop
        vNLine := vNLine + 1;

        if vNLine = 1
        then
          for i in 1 .. array_length(r.obj, 1) 
          loop
            if r.obj[i] in ('Дата') then
              vIndex_Date := i;
            elseif r.obj[i] in ('Счет') 
            then
              vIndex_Account := i;
            elseif r.obj[i] in ('Категория расхода', 'Категория дохода') 
            then
              vIndex_Category := i;
            elseif r.obj[i] in ('Подкатегория расхода', 'Подкатегория дохода') 
            then
              vIndex_Sub_Category := i;
            elseif r.obj[i] in ('Кол.') 
            then
              vIndex_Quantity := i;
            elseif r.obj[i] in ('Ед. изм.') 
            then
              vIndex_Unit := i;
            elseif r.obj[i] in ('Евро|Сумма') 
            then
              vIndex_Euro := i;
            elseif r.obj[i] in ('Рубли|Сумма') 
            then
              vIndex_Rub := i;
            elseif r.obj[i] in ('Доллары|Сумма') 
            then
              vIndex_Dollar := i;
            elseif r.obj[i] in ('Примечание') 
            then
              vIndex_Note := i;
            end if;
          end loop;

          if vIndex_Date is null 
          then
	          perform error$.raise ('invalid_file_format', iMessage := 'Не найден столбец "Дата". Пожалуйста, проверьте формат файла');
          end if;
          
          if vIndex_Account is null 
          then
	          perform error$.raise ('invalid_file_format', iMessage := 'Не найден столбец "Счет". Пожалуйста, проверьте формат файла');
          end if;
          
          if vIndex_Category is null 
          then
            if iImport_Source_Type_Code = 1 
            then
  	          perform error$.raise ('invalid_file_format', iMessage := 'Не найден столбец "Категория расхода". Пожалуйста, проверьте формат файла');
            else
  	          perform error$.raise ('invalid_file_format', iMessage := 'Не найден столбец "Категория дохода". Пожалуйста, проверьте формат файла');
            end if;
          end if;

          if vIndex_Sub_Category is null 
          then
            if iImport_Source_Type_Code = 1 
            then
  	          perform error$.raise ('invalid_file_format', iMessage := 'Не найден столбец "Подкатегория расхода". Пожалуйста, проверьте формат файла');
            else
  	          perform error$.raise ('invalid_file_format', iMessage := 'Не найден столбец "Подкатегория дохода". Пожалуйста, проверьте формат файла');
            end if;
          end if;

          if vIndex_Sub_Category is null 
          then
	          perform error$.raise ('invalid_file_format', iMessage := 'Не найден столбец "Кол.". Пожалуйста, проверьте формат файла');
          end if;

          if     vIndex_Euro is null 
             and vIndex_Dollar is null 
             and vIndex_Rub is null 
          then
  	        perform error$.raise ('invalid_file_format', iMessage := 'Не найден столбец "Рубли|Сумма", "Евро|Сумма" или "Доллары|Сумма". Пожалуйста, проверьте формат файла');
          end if;

          continue;
        end if;
        
        vUnit := null;
        vAccount := null;
        vCategory := null;
        vCategory_Parent := null;
        vId_Money := null;
        
        if nullif (trim (r.obj[1]), '') is not null then
          begin
            -- Ед.измерения
            vUnit.name := sanitize$.to_String (r.obj[vIndex_Unit]);
            if vUnit.name is not null 
            then
              vUnit.Id_Unit := vUnits->upper(vUnit.name);
              
              if vUnit.Id_Unit is null 
              then
                vIs_New_Unit := true;
                insert into cf$.Unit (Name)
                     values (vUnit.name)
                  returning Id_Unit
                       into vUnit.Id_Unit;
                 vUnits := vUnits || hstore (upper(vUnit.name), vUnit.Id_Unit::text);
               end if;
            end if;

            -- Родительская категория
            vCategory_Parent.name := sanitize$.to_String (r.obj[vIndex_Category]);
            
            if vCategory_Parent.name is null 
            then
              vErrors_Count := vErrors_Count + 1;
              if vErrors_Count <= vMax_Errors_Count then
                vErrors := concat_ws (',', vErrors,
                                     json_build_object ('message', 'Пустая категория',
                                                        'nLine', vNLine,
                                                        'text', r.obj::text
                                                       ));
              end if;
              continue;
            else
              vCategory_Parent.Id_Category := vCategories->('$$$' || upper(vCategory_Parent.name));
              if vCategory_Parent.Id_Category is null 
              then

                vIs_New_Category := true;
                insert into cf$.Category (Name, Parent)
                     values (vCategory_Parent.name, null)
                  returning Id_Category
                       into vCategory_Parent.Id_Category;
                 vCategories := vCategories || hstore ('$$$' || upper(vCategory_Parent.name), vCategory_Parent.Id_Category::text);
               end if;
            end if;

            -- Подкатегория
            vCategory.Parent = vCategory_Parent.Id_Category;
            vCategory.name = sanitize$.to_String (r.obj[vIndex_Sub_Category]);
            if vCategory.name is null 
            then
              -- Если нет подкатегории, то используем родительскую
              vCategory.Id_Category := vCategory_Parent.Id_Category;
            else
              vCategory.Id_Category := vCategories->(vCategory.Parent::text || '$$$' || upper(vCategory.name));
              if vCategory.Id_Category is null 
              then
                vIs_New_Category := true;
                insert into cf$.Category (Name, Parent)
                     values (vCategory.name, vCategory.Parent)
                  returning Id_Category
                       into vCategory.Id_Category;
                       
                 vCategories := vCategories || hstore (vCategory.Parent::text || '$$$' || upper(vCategory.name), vCategory.Id_Category::text);
               end if;
            end if;

            -- Счет
            vAccount.name := sanitize$.to_String (r.obj[vIndex_Account]);
            if vAccount.name is null 
            then
              vErrors_Count := vErrors_Count + 1;
              if vErrors_Count <= vMax_Errors_Count then
                vErrors := concat_ws (',', vErrors,
                                      json_build_object ('message', 'Пустой счет',
                                                         'nLine', vNLine,
                                                         'text', r.obj::text
                                                        ));
              end if;
              continue;
            else
              vAccount.Id_Account := vAccounts->upper(vAccount.name);
              if vAccount.Id_Account is null 
              then
                vIs_New_Account := true;
                -- 5 - Другое
                insert into cf$.Account (Name, Id_Account_Type)
                     values (vAccount.name, 5)
                  returning Id_Account
                       into vAccount.Id_Account;
                 vAccounts := vAccounts || hstore (upper(vAccount.name), vAccount.Id_Account::text);
               end if;
            end if;
            
            -- Валюта
            vId_Money := null;
            if coalesce (sanitize$.to_numeric(r.obj[vIndex_Rub]), 0) != 0
            then
              vId_Money := vId_Money_Rub;
              vSum := sanitize$.to_numeric(r.obj[vIndex_Rub]);
            elsif coalesce (sanitize$.to_numeric(r.obj[vIndex_Euro]), 0) != 0 
            then
              vId_Money := vId_Money_Euro;
              vSum := sanitize$.to_numeric(r.obj[vIndex_Euro]);
            elsif coalesce (sanitize$.to_numeric(r.obj[vIndex_Dollar]), 0) != 0 
            then
              vId_Money := vId_Money_Dollar;
              vSum := sanitize$.to_numeric(r.obj[vIndex_Dollar]);
            end if;

            if vId_Money is null 
            then
              vErrors_Count := vErrors_Count + 1;
              if vErrors_Count <= vMax_Errors_Count then
                vErrors := concat_ws (',', vErrors,
                                     json_build_object ('message', 'Ошибка определения суммы и валюты транзакции',
                                                        'nLine', vNLine,
                                                        'text', r.obj::text
                                                       ));
              end if;
              continue;
            end if;
              
            vDCashFlow_Detail := sanitize$.to_date(r.obj[vIndex_Date], 'dd.mm.yyyy');
            vId_CashFlow := null;

            if iIsGroup 
            then
              vKey := concat_ws('$', r.obj[vIndex_Date], vAccount.Id_Account, vCategory.Parent);
              vId_CashFlow := vCashFlow->vKey;
              
--              select cfd.Id_CashFlow
--                into vId_CashFlow
--               from cf$.CashFlow_Detail cfd
--                    join cf$.v_Category c
--                      on (c.Id_Category = cfd.Id_Category)
--              where cfd.Id_Project = vId_Project
--                and cfd.Id_Account = vAccount.Id_Account
--                and cfd.DCashFlow_Detail = vDCashFlow_Detail
--                and c.Parent = vCategory.Parent;
            end if;
                
            if vId_CashFlow is null 
            then
              insert into cf$.CashFlow (Id_Contractor, Id_CashFlow_Type, Tags)
                   values (null, 1, vTags_0)
                returning Id_CashFlow
                     into vId_CashFlow;

              if iIsGroup 
              then
                vCashFlow := vCashFlow || hstore (vKey, vId_CashFlow::text);
              end if;
                     
            end if;

           insert into cf$.CashFlow_Detail (Id_CashFlow, 
                                            Id_Account, 
                                            Id_Category, 
                                            Id_Money, 
                                            Id_Unit, 
                                            Sign, 
                                            DCashFlow_Detail, 
                                            Quantity, 
                                            Sum,  
                                            Note,
                                            Tags)
                 values (vId_CashFlow, vAccount.Id_Account, vCategory.Id_Category, vId_Money, vUnit.Id_Unit, 
                         case when iImport_Source_Type_Code = 1 then -1 else 1 end, 
                         vDCashFlow_Detail,
                         sanitize$.to_numeric(r.obj[vIndex_Quantity]), vSum, sanitize$.to_String (r.obj[vIndex_Note]),
                         vTags);
                
            vLoaded_Count := vLoaded_Count + 1;
          exception
            when others then
              vErrors_Count := vErrors_Count + 1;
              if vErrors_Count <= vMax_Errors_Count then
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
  -- перемещение
  elsif iImport_Source_Type_Code = 3 then
    declare
      vIndex_Date         integer;
      vIndex_Account_From integer;
      vIndex_Account_To   integer;
      vIndex_Sum          integer;
      vIndex_Note         integer;
        
      vAccount_From      cf$.Account%rowtype;
      vAccount_To        cf$.Account%rowtype;
      vId_CashFlow       cf$.CashFlow.Id_CashFlow%type;
      vId_Money          cf$.Money.Id_Money%type;
      vSum               numeric;
      vDCashFlow_Detail  cf$.CashFlow_Detail.DCashFlow_Detail%type;

       -- Перемещение
      vId_Category_Transfer_11  cf$.Category.Id_Category%type := cf$_Category.get_Category_By_Prototype(11);

      vAccounts hstore;
    begin
      select coalesce (hstore (array_agg (upper(a.name) order by a.Id_Account), 
                               array_agg (a.Id_Account::text order by a.Id_Account)), ''::hstore)
        into vAccounts
        from cf$.v_Account a;

      --for r in (select json.csv_to_jsonb(core$_File.get_content(iId_File), iDelimiter) as obj) loop
      for r in (select lib.csv_to_arrays (core$_File.get_content(iId_File), iDelimiter) as obj) 
      loop
        vNLine := vNLine + 1;
        if vNLine = 1
        then
          for i in 1 .. array_length(r.obj, 1) 
          loop
            if r.obj[i] in ('Дата') 
            then
              vIndex_Date := i;
            elseif r.obj[i] in ('Со счета') 
            then
              vIndex_Account_From := i;
            elseif r.obj[i] in ('На счет') 
            then
              vIndex_Account_To := i;
            elseif r.obj[i] in ('Сумма') 
            then
              vIndex_Sum := i;
            elseif r.obj[i] in ('Примечание') 
            then
              vIndex_Note := i;
            end if;
          end loop;

          if vIndex_Date is null 
          then
	          perform error$.raise ('invalid_file_format', iMessage := 'Не найден столбец "Дата". Пожалуйста, проверьте формат файла');
          end if;
          if vIndex_Account_From is null 
          then
	          perform error$.raise ('invalid_file_format', iMessage := 'Не найден столбец "Со счета". Пожалуйста, проверьте формат файла');
          end if;
          if vIndex_Account_To is null 
          then
  	        perform error$.raise ('invalid_file_format', iMessage := 'Не найден столбец "На счет". Пожалуйста, проверьте формат файла');
          end if;
          if vIndex_Sum is null 
          then
	          perform error$.raise ('invalid_file_format', iMessage := 'Не найден столбец "Сумма". Пожалуйста, проверьте формат файла');
          end if;

          continue;
        end if;
        if nullif (trim (r.obj[1]), '') is not null 
        then
          begin
            -- Со счета
            vAccount_From.name := sanitize$.to_String (r.obj[vIndex_Account_From]);
            if vAccount_From.name is null then
              vErrors_Count := vErrors_Count + 1;
              if vErrors_Count <= vMax_Errors_Count then
                vErrors := concat_ws (',', vErrors,
                                      json_build_object ('message', 'Пустое поле "Со счета"',
                                                         'nLine', vNLine,
                                                         'text', r.obj::text
                                                        ));
              end if;
              continue;
            else
              vAccount_From.Id_Account := vAccounts->upper(vAccount_From.name);
              if vAccount_From.Id_Account is null 
              then
                vIs_New_Account := true;
                insert into cf$.Account (Name, Id_Account_Type)
                     values (vAccount_From.name, 5)
                  returning Id_Account
                       into vAccount_From.Id_Account;
                 vAccounts := vAccounts || hstore (upper(vAccount_From.name), vAccount_From.Id_Account::text);
               end if;
            end if;

            -- На счет
            vAccount_To.name := sanitize$.to_String (r.obj[vIndex_Account_To]);
            if vAccount_To.name is null 
            then
              vErrors_Count := vErrors_Count + 1;
              if vErrors_Count <= vMax_Errors_Count then
                vErrors := concat_ws (',', vErrors,
                                      json_build_object ('message', 'Пустое поле "На счет"',
                                                         'nLine', vNLine,
                                                         'text', r.obj::text
                                                        ));
              end if;
              continue;
            else
              vAccount_To.Id_Account := vAccounts->upper(vAccount_To.name);
              if vAccount_To.Id_Account is null 
              then
                vIs_New_Account := true;
                insert into cf$.Account (Name, Id_Account_Type)
                     values (vAccount_To.name, 5)
                  returning Id_Account
                       into vAccount_To.Id_Account;
                 vAccounts := vAccounts || hstore (upper(vAccount_To.name), vAccount_To.Id_Account::text);
               end if;
            end if;

            -- Валюта
            vId_Money := null;
            select case substring((r.obj[vIndex_Sum]) from length(r.obj[vIndex_Sum]) for 1) 
                     when 'р' then vId_Money_Rub
                     when 'Є' then vId_Money_Euro
                     when '$' then vId_Money_Dollar
                   end
              into vId_Money;

            if vId_Money is null then
              vErrors_Count := vErrors_Count + 1;
              if vErrors_Count <= vMax_Errors_Count then
                vErrors := concat_ws (',', vErrors,
                                      json_build_object ('message', 'Ошибка определения валюты',
                                                         'nLine', vNLine,
                                                         'text', r.obj::text
                                                        ));
              end if;
              continue;
            end if;
                
            vSum := sanitize$.to_numeric (substring (trim (r.obj[vIndex_Sum]) from 1 for length (trim (r.obj[vIndex_Sum])) - 1));
              
            -- Денежный поток
            insert into cf$.CashFlow (Id_CashFlow_Type, Note, Tags)
                 values (3, r.obj[vIndex_Note], vTags)
              returning Id_CashFlow
                   into vId_CashFlow;

            vDCashFlow_Detail := sanitize$.to_date(r.obj[vIndex_Date], 'dd.mm.yyyy');
            insert into cf$.CashFlow_Detail (Id_CashFlow, 
                                             Id_Account, 
                                             Id_Category, 
                                             Id_Money, 
                                             Sign, 
                                             DCashFlow_Detail, 
                                             Quantity, 
                                             Sum)
                 values (vId_CashFlow, vAccount_From.Id_Account, vId_Category_Transfer_11, vId_Money, -1, vDCashFlow_Detail, 1, vSum),
                        (vId_CashFlow, vAccount_To.Id_Account, vId_Category_Transfer_11, vId_Money, 1, vDCashFlow_Detail, 1, vSum);
                
            vLoaded_Count := vLoaded_Count + 1;
          exception
           when others then
              vErrors_Count := vErrors_Count + 1;
              if vErrors_Count <= vMax_Errors_Count then
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
  elsif iImport_Source_Type_Code in (4,5) then
    -- Долги
    declare
      vIndex_Date              integer;
      vIndex_DRedemption       integer;
      vIndex_Contractor        integer;
      vIndex_Account           integer;
      vIndex_Rub               integer;
      vIndex_Euro              integer;
      vIndex_Dollar            integer;
      vIndex_Redemption_Rub    integer;
      vIndex_Redemption_Euro   integer;
      vIndex_Redemption_Dollar integer;
      vIndex_Note              integer;
        
      vAccount            cf$.Account%rowtype;
      vContractor         cf$.Contractor%rowtype;
      vId_CashFlow        cf$.CashFlow.Id_CashFlow%type;
      vId_Money           cf$.Money.Id_money%type;
      vRedemption         numeric;
      vSum                numeric;
      vDCashFlow_Detail   cf$.CashFlow_Detail.DCashFlow_Detail%type;
       
      -- Основная сумма долга
      vId_Category_Debt_2  cf$.Category.Id_Category%type := cf$_Category.get_Category_By_Prototype(2);
      vId_Category_Debt_3  cf$.Category.Id_Category%type := cf$_Category.get_Category_By_Prototype(3);

      vAccounts      hstore;
      vContractors   hstore;
    begin
      select coalesce (hstore (array_agg (upper(a.name) order by a.Id_Account), 
                               array_agg (a.Id_Account::text order by a.Id_Account)), ''::hstore)
        into vAccounts
        from cf$.v_Account a;

      select coalesce (hstore (array_agg (upper(c.name) order by c.Id_Contractor), 
                               array_agg (c.Id_Contractor::text order by c.Id_Contractor)), ''::hstore)
        into vContractors
        from cf$.v_Contractor c;

--      for r in (select json.csv_to_jsonb(core$_File.get_content(iId_File), iDelimiter) as obj) 
      for r in (select lib.csv_to_arrays (core$_File.get_content(iId_File), iDelimiter) as obj) 
      loop
        vNLine := vNLine + 1;
        if vNLine = 1
        then
          for i in 1 .. array_length(r.obj, 1) 
          loop
            if r.obj[i] in ('Дата') 
            then
              vIndex_Date := i;
            elseif r.obj[i] in ('Счет') 
            then
              vIndex_Account := i;
            elseif r.obj[i] in ('Должник', 'Кредитор') 
            then
              vIndex_Contractor := i;
            elseif r.obj[i] in ('Дата закрытия') 
            then
              vIndex_DRedemption := i;
            elseif r.obj[i] in ('Сумма|Евро') 
            then
              vIndex_Euro := i;
            elseif r.obj[i] in ('Сумма|Рубли') 
            then
              vIndex_Rub := i;
            elseif r.obj[i] in ('Сумма|Доллары') 
            then
              vIndex_Dollar := i;
            elseif r.obj[i] in ('Возврат|Евро') 
            then
              vIndex_Redemption_Euro := i;
            elseif r.obj[i] in ('Возврат|Рубли') 
            then
              vIndex_Redemption_Rub := i;
            elseif r.obj[i] in ('Возврат|Доллары') 
            then
              vIndex_Redemption_Dollar := i;
            elseif r.obj[i] in ('Примечание') 
            then
              vIndex_Note := i;
            end if;
          end loop;

          if vIndex_Date is null 
          then
	          perform error$.raise ('invalid_file_format', iMessage := 'Не найден столбец "Дата". Пожалуйста, проверьте формат файла');
          end if;
          if vIndex_Account is null 
          then
	          perform error$.raise ('invalid_file_format', iMessage := 'Не найден столбец "Счет". Пожалуйста, проверьте формат файла');
          end if;
          if vIndex_Contractor is null 
          then
            if iImport_Source_Type_Code = 4 then
  	          perform error$.raise ('invalid_file_format', iMessage := 'Не найден столбец "Должник". Пожалуйста, проверьте формат файла');
            else
  	          perform error$.raise ('invalid_file_format', iMessage := 'Не найден столбец "Кредитор". Пожалуйста, проверьте формат файла');
            end if;
          end if;
          if     vIndex_Euro is null 
             and vIndex_Dollar is null 
             and vIndex_Rub is null 
          then
	          perform error$.raise ('invalid_file_format', iMessage := 'Не найден столбец "Рубли|Сумма", "Евро|Сумма" или "Доллары|Сумма". Пожалуйста, проверьте формат файла');
          end if;

          continue;
        end if;

        if nullif (trim (r.obj[1]), '') is not null then
          begin
            -- Счет
            vAccount.name := sanitize$.to_String (r.obj[vIndex_Account]);
            if vAccount.name is null then
              vErrors_Count := vErrors_Count + 1;
              if vErrors_Count <= vMax_Errors_Count then
                vErrors := concat_ws (',', vErrors,
                                      json_build_object ('message', 'Пустое поле "Счет"',
                                                         'nLine', vNLine,
                                                         'text', r.obj::text
                                                        ));
              end if;
              continue;
            else
              vAccount.Id_Account := vAccounts->upper(vAccount.name);
              if vAccount.Id_Account is null 
              then
                vIs_New_Account := true;
                insert into cf$.Account (Name, Id_Account_Type)
                     values (vAccount.name, 5)
                  returning Id_Account
                       into vAccount.Id_Account;
                 vAccounts := vAccounts || hstore (upper(vAccount.name), vAccount.Id_Account::text);
               end if;
            end if;

            -- Контрагент
            vContractor.name := sanitize$.to_String (r.obj[vIndex_Contractor]);
            if vContractor.name is null 
            then
              vErrors_Count := vErrors_Count + 1;
              if vErrors_Count <= vMax_Errors_Count 
              then
                vErrors := concat_ws (',', vErrors,
                                      json_build_object ('message', 'Пустое поле "Должник"',
                                                         'nLine', vNLine,
                                                         'text', r.obj::text
                                                        ));
              end if;
              continue;
            else
              vContractor.Id_Contractor := vContractors->upper(vContractor.name);
              if vContractor.Id_Contractor is null 
              then
                vIs_New_Contractor := true;

                insert into cf$.Contractor (Name)
                     values (vContractor.name)
                  returning Id_Contractor
                       into vContractor.Id_Contractor;
                 vContractors := vContractors || hstore (upper(vContractor.name), vContractor.Id_Contractor::text);
               end if;
            end if;

            -- Валюта
            vId_Money := null;
            vRedemption := 0;
            vSum := 0;
            if coalesce (sanitize$.to_numeric(r.obj[vIndex_Rub]), 0) != 0 
            then
              vId_Money := vId_Money_Rub;
              vSum := sanitize$.to_numeric(r.obj[vIndex_Rub]);
              vRedemption := sanitize$.to_numeric(r.obj[vIndex_Redemption_Rub]);
            elsif coalesce (sanitize$.to_numeric(r.obj[vIndex_Euro]), 0) != 0 
            then
              vId_Money := vId_Money_Euro;
              vSum := sanitize$.to_numeric(r.obj[vIndex_Euro]);
              vRedemption := sanitize$.to_numeric(r.obj[vIndex_Redemption_Euro]);
            elsif coalesce (sanitize$.to_numeric(r.obj[vIndex_Dollar]), 0) != 0 
            then
              vId_Money := vId_Money_Dollar;
              vSum := sanitize$.to_numeric(r.obj[vIndex_Dollar]);
              vRedemption := sanitize$.to_numeric(r.obj[vIndex_Redemption_Dollar]);
            end if;

            if vId_Money is null 
            then
              vErrors_Count := vErrors_Count + 1;
              if vErrors_Count <= vMax_Errors_Count 
              then
                vErrors := concat_ws (',', vErrors,
                                      json_build_object ('message', 'Ошибка определения валюты',
                                                         'nLine', vNLine,
                                                         'text', r.obj::text
                                                        ));
              end if;
              continue;
            end if;
              
            -- Денежный поток
            insert into cf$.CashFlow (Id_Contractor, Id_CashFlow_Type, Note, Tags)
                 values (vContractor.Id_Contractor, 2, sanitize$.to_String (r.obj[vIndex_Note]), vTags_0)
              returning Id_CashFlow
                   into vId_CashFlow;

           vDCashFlow_Detail := sanitize$.to_date(r.obj[vIndex_Date], 'dd.mm.yyyy');

           insert into cf$.CashFlow_Detail (Id_CashFlow, 
                                            Id_Account, 
                                            Id_Category, 
                                            Id_Money, 
                                            Sign, 
                                            DCashFlow_Detail, 
                                            Quantity, 
                                            Sum, 
                                            Tags)
                 values (vId_CashFlow, vAccount.Id_Account, vId_Category_Debt_2, vId_Money, 
                         case when iImport_Source_Type_Code = 4 then -1 else 1 end, 
                         vDCashFlow_Detail, 1, vSum, vTags);

           if coalesce (vRedemption, 0) != 0 
           then
             insert into cf$.CashFlow_Detail (Id_CashFlow, 
                                              Id_Account, 
                                              Id_Category, 
                                              Id_Money, 
                                              Sign, 
                                              DCashFlow_Detail, 
                                              Quantity, 
                                              Sum,
                                              Tags)
                   values (vId_CashFlow, vAccount.Id_Account, vId_Category_Debt_3, vId_Money, 
                           case when iImport_Source_Type_Code = 4 then 1 else -1 end, 
                           coalesce (sanitize$.to_date(r.obj[vIndex_DRedemption], 'dd.mm.yyyy'), vDCashFlow_Detail), 1, 
                           vRedemption, vTags);
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
  elsif iImport_Source_Type_Code = 6 
  then
    -- Обмен валюты
    declare
      vIndex_Date        integer;
      vIndex_Account     integer;
      vIndex_From_Rub    integer;
      vIndex_From_Euro   integer;
      vIndex_From_Dollar integer;
      vIndex_To_Rub      integer;
      vIndex_To_Euro     integer;
      vIndex_To_Dollar   integer;
      vIndex_Note        integer;
        
      vAccount           cf$.Account%rowtype;
      vId_CashFlow       cf$.CashFlow.Id_CashFlow%type;
      vId_Money_From     cf$.Money.Id_Money%type;
      vId_Money_To       cf$.Money.Id_Money%type;
      vSum_From          numeric;
      vSum_To            numeric;

      -- Обмен
      vId_Category_Exchange_21  cf$.Category.Id_Category%type := cf$_Category.get_Category_By_Prototype(21);
       
      vAccounts          hstore;
    begin
      select coalesce (hstore (array_agg (upper (a.name) order by a.Id_Account), 
                               array_agg (a.Id_Account::text order by a.Id_Account)), ''::hstore)
        into vAccounts
        from cf$.v_Account a;

      --for r in (select json.csv_to_jsonb(core$_File.get_content(iId_File), iDelimiter) as obj)
      for r in (select lib.csv_to_arrays (core$_File.get_content(iId_File), iDelimiter) as obj) 
      loop
        vNLine := vNLine + 1;
        if vNLine = 1
        then
          for i in 1 .. array_length(r.obj, 1) 
          loop
            if r.obj[i] in ('Дата') 
            then
              vIndex_Date := i;
            elseif r.obj[i] in ('Счет') 
            then
              vIndex_Account := i;
            elseif r.obj[i] in ('Отдано|Рубли') 
            then
              vIndex_From_Rub := i;
            elseif r.obj[i] in ('Отдано|Евро') 
            then
              vIndex_From_Euro := i;
            elseif r.obj[i] in ('Отдано|Доллары') 
            then
              vIndex_From_Dollar := i;
            elseif r.obj[i] in ('Получено|Евро') 
            then
              vIndex_To_Euro := i;
            elseif r.obj[i] in ('Получено|Доллары') 
            then
              vIndex_To_Dollar := i;
            elseif r.obj[i] in ('Получено|Рубли') 
            then
              vIndex_To_Rub := i;
            elseif r.obj[i] in ('Примечание') 
            then
              vIndex_Note := i;
            end if;
          end loop;

          if vIndex_Date is null 
          then
	          perform error$.raise ('invalid_file_format', iMessage := 'Не найден столбец "Дата". Пожалуйста, проверьте формат файла');
          end if;
          if vIndex_Account is null 
          then
	          perform error$.raise ('invalid_file_format', iMessage := 'Не найден столбец "Счет". Пожалуйста, проверьте формат файла');
          end if;

          if     vIndex_From_Rub is null 
             and vIndex_From_Euro is null 
             and vIndex_From_Dollar is null 
          then
	          perform error$.raise ('invalid_file_format', iMessage := 'Не найден столбец "Отдано|Рубли", "Отдано|Евро" или "Отдано|Доллары". Пожалуйста, проверьте формат файла');
          end if;
          
          if     vIndex_To_Rub is null 
             and vIndex_To_Euro is null 
             and vIndex_To_Dollar is null 
          then
  	        perform error$.raise ('invalid_file_format', iMessage := 'Не найден столбец "Получено|Рубли", "Получено|Евро" или "Получено|Доллары". Пожалуйста, проверьте формат файла.');
          end if;

          continue;
        end if;
        if nullif (trim (r.obj[1]), '') is not null 
        then
          begin
            -- Счет
            vAccount.name := sanitize$.to_String (r.obj[vIndex_Account]);
            if vAccount.name is null 
            then
              vErrors_Count := vErrors_Count + 1;
              if vErrors_Count <= vMax_Errors_Count then
                vErrors := concat_ws (',', vErrors,
                                      json_build_object ('message', 'Пустое поле "Счет"',
                                                         'nLine', vNLine,
                                                         'text', r.obj::text
                                                        ));
              end if;
              continue;
            else
              vAccount.Id_Account := vAccounts->upper(vAccount.name);
              if vAccount.Id_Account is null 
              then
                vIs_New_Account := true;
                insert into cf$.Account (Name, Id_Account_Type)
                     values (vAccount.name, 5)
                  returning Id_Account
                       into vAccount.Id_Account;
                 vAccounts := vAccounts || hstore (upper(vAccount.name), vAccount.Id_Account::text);
               end if;
            end if;

            -- Валюта
            vId_Money_From := null;
            if coalesce (sanitize$.to_numeric(r.obj[vIndex_From_Rub]), 0) != 0 
            then
              vId_Money_From := vId_Money_Rub;
              vSum_From := sanitize$.to_numeric(r.obj[vIndex_From_Rub]);
            elsif coalesce(sanitize$.to_numeric(r.obj[vIndex_From_Euro]), 0) != 0 
            then
              vId_Money_From := vId_Money_Euro;
              vSum_From := sanitize$.to_numeric(r.obj[vIndex_From_Euro]);
            elsif coalesce(sanitize$.to_numeric(r.obj[vIndex_From_Dollar]), 0) != 0 
            then
              vId_Money_From := vId_Money_Dollar;
              vSum_From := sanitize$.to_numeric(r.obj[vIndex_From_Dollar]);
            end if;

            if vId_Money_From is null 
            then
              vErrors_Count := vErrors_Count + 1;
              if vErrors_Count <= vMax_Errors_Count then
                vErrors := concat_ws (',', vErrors,
                                      json_build_object ('message', 'Ошибка определения валюты продажи',
                                                         'nLine', vNLine,
                                                         'text', r.obj::text
                                                        ));
              end if;
              continue;
            end if;

            vId_Money_To := null;
            if coalesce(sanitize$.to_numeric(r.obj[vIndex_To_Rub]), 0) != 0 
            then
              vId_Money_To := vId_Money_Rub;
              vSum_To := sanitize$.to_numeric(r.obj[vIndex_To_Rub]);
            elsif coalesce(sanitize$.to_numeric(r.obj[vIndex_To_Euro]), 0) != 0 
            then
              vId_Money_To := vId_Money_Euro;
              vSum_To := sanitize$.to_numeric(r.obj[vIndex_To_Euro]);
            elsif coalesce(sanitize$.to_numeric(r.obj[vIndex_To_Dollar]), 0) != 0 
            then
              vId_Money_To := vId_Money_Dollar;
              vSum_To := sanitize$.to_numeric(r.obj[vIndex_To_Dollar]);
            end if;
            
            if vId_Money_To is null 
            then
              vErrors_Count := vErrors_Count + 1;
              if vErrors_Count <= vMax_Errors_Count then
                vErrors := concat_ws (',', vErrors,
                                      json_build_object ('message', 'Ошибка определения валюты покупки',
                                                         'nLine', vNLine,
                                                         'text', r.obj::text
                                                        ));
              end if;
              continue;
            end if;

              
            -- Денежный поток
            insert into cf$.CashFlow (Id_CashFlow_Type, Note, Tags)
                 values (4, r.obj[vIndex_Note], vTags)
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
                 values (vId_CashFlow, vAccount.Id_Account, vId_Category_Exchange_21, vId_Money_From, -1, 
                         sanitize$.to_date(r.obj[vIndex_Date], 'dd.mm.yyyy'), 1, vSum_From),
                        (vId_CashFlow, vAccount.Id_Account, vId_Category_Exchange_21, vId_Money_To, 1, 
                         sanitize$.to_date(r.obj[vIndex_Date], 'dd.mm.yyyy'), 1, vSum_To);

            vLoaded_Count := vLoaded_Count + 1;
          exception
           when others then
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

  if vIs_New_Unit 
  then
   vReferences := concat_ws (',', vReferences, cf$_unit.get ('{}'::jsonb));
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
