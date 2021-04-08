CREATE OR REPLACE FUNCTION "cf$_project".merge(iid_project_from integer, iid_project_to integer, OUT tags_count integer, OUT units_count integer, OUT accounts_count integer, OUT categories_count integer, OUT contractors_count integer, OUT cashflows_count integer, OUT cashflow_details_count integer, OUT moneys_count integer, OUT plans_count integer)
 RETURNS record
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vId_Tag        cf$.tag.Id_Tag%type;
  vId_Unit       cf$.unit.Id_Unit%type;
  vId_Account    cf$.Account.Id_Account%type;
  vId_Category   cf$.Category.Id_Category%type;
  vId_Contractor cf$.Contractor.Id_Contractor%type;
  vId_Money      cf$.Money.Id_Money%type;
  vId_Plan       cf$.Plan.Id_Plan%type;
  
  vId_CashFlow  cf$.CashFlow.Id_CashFlow%type;

  vTags_Map        hstore := ''::hstore;
  vUnits_Map       hstore := ''::hstore;
  vAccounts_Map    hstore := ''::hstore;
  vCategories_Map  hstore := ''::hstore;
  vContractors_Map hstore := ''::hstore;
  vMoneys_Map      hstore := ''::hstore;
  vPlans_Map       hstore := ''::hstore;
  
  vCategories hstore;
  
  r  record;
  vPrev_Id_Project    text := context.get('Id_Project');

  --vTime timestamptz := clock_timestamp();
begin
  -- perform context.set('Id_Project', iId_Project_To::text, false);

  --vTime := lib.console_log ('begin', vTime);
    
  Units_Count := 0;
  Tags_Count := 0;
  Accounts_Count := 0;
  Categories_Count := 0;
  Contractors_Count := 0;
  CashFlows_Count := 0;
  CashFlow_Details_Count := 0;
  Moneys_Count := 0;

  -- Tags
  for r in (select t.Id_Tag,
                   t.name
              from cf$.Tag t
             where t.Id_Project = iId_Project_From) 
  loop
    -- Ищим тег в целевом проекте и сохраняем перекодировку
    select t.Id_tag
      into vId_Tag
      from cf$.Tag t
     where t.Id_Project = iId_Project_To
       and upper(t.Name) = upper(r.Name);
     
    if vId_Tag is null
    then 
      insert into cf$.Tag (Id_Project, Name)
           values (iId_Project_To, r.name)
        returning Id_Tag
             into vId_Tag;
      Tags_Count := Tags_Count + 1;
    end if;

    vTags_Map := vTags_Map || hstore (r.Id_Tag::text, vId_Tag::text);
  end loop;
  --vTime := lib.console_log ('Tags', vTime);

  -- Units
  for r in (select u.id_Unit,
                   u.name
              from cf$.Unit u
             where u.Id_Project = iId_Project_From)
  loop
    select u.Id_Unit
      into vId_Unit
      from cf$.Unit u
     where u.Id_Project = iId_Project_To
       and upper(u.Name) = upper(r.Name);
     
    if vId_Unit is null
    then 
      insert into cf$.Unit (Id_Project, Name)
           values (iId_Project_To, r.name)
        returning Id_Unit
             into vId_Unit;
      Units_Count := Units_Count + 1;
    end if;

    vUnits_Map := vUnits_Map || hstore (r.Id_Unit::text, vId_Unit::text);
  end loop;
  --vTime := lib.console_log ('Unit', vTime);

  -- Accounts
  for r in (select a.id_account,
                   a.name,
                   a.is_enabled,
                   a.note,
                   a.Id_Account_Type
              from      cf$_account.permit(iId_Project_From) p
                   join cf$.account a using (Id_Project, Id_Account))
  loop
    select a.Id_Account
      into vId_Account
      from cf$.Account a
     where a.Id_Project = iId_Project_To
       and upper(a.Name) = upper(r.Name);
     
    if vId_Account is null
    then
      insert into cf$.Account  
                  (Id_Project, name, Is_Enabled, note, Id_Account_Type)
           values (iId_Project_To, r.name, r.Is_Enabled, r.Note, r.Id_Account_Type)
        returning Id_Account
             into vId_Account;
      Accounts_Count := Accounts_Count + 1;
    end if;
    vAccounts_Map := vAccounts_Map || hstore (r.Id_Account::text, vId_Account::text);
  end loop;
  --vTime := lib.console_log ('Accounts', vTime);

  -- Categories
  -- Make a hash
  select coalesce (hstore (array_agg (upper (cf$_Category.Full_Name (c.Id_Category, '@#$', c.Id_Project)) order by c.Id_Category), 
                           array_agg (c.Id_Category::text order by c.Id_Category)), ''::hstore)
    into vCategories 
    from cf$.Category c
   where c.Id_Project = iId_Project_To;

  for r in (select c.Id_Category,
                   c.parent,
                   c.id_unit,
                   c.is_enabled,
                   c.is_system,
                   c.name,
                   c.note,
                   c.Id_Category_Prototype,
                   upper (cf$_Category.Full_Name(c.Id_Category, '@#$', c.Id_Project)) as Full_Name
              from cf$.Category c
             where c.Id_Project = iId_Project_From
             order by Full_Name
           ) 
  loop
    -- проверяем в кэше
    vId_Category := vCategories->r.Full_Name;

    -- Подстраховка
    if     r.parent is not null
       and (vCategories_Map->r.parent::text) is null
    then
      perform error$.raise ('internal_server_error', iDev_Message := 'Не найдена родительская категория для ' || r.Name);
    end if;
    
    if     r.Id_Unit is not null 
       and (vUnits_Map->r.Id_Unit::text) is null
    then
      perform error$.raise ('internal_server_error', iDev_Message := 'Не найдена ед.измерения при копировании категории');
    end if;
    
    if vId_Category is null
    then
      insert into cf$.Category
                  (Id_Project, name, Is_Enabled, Is_System, Id_Unit, Parent, Note, Id_Category_Prototype)
           values (iId_Project_To,
                   r.name, 
                   r.Is_Enabled, 
                   r.Is_System, 
                   (vUnits_Map->r.Id_Unit::text)::int,
                   (vCategories_Map->r.parent::text)::int, 
                   r.Note,
                   r.Id_Category_Prototype)
        returning Id_Category
             into vId_Category;
      Categories_Count := Categories_Count + 1;
    end if;
    vCategories_Map := vCategories_Map || hstore (r.Id_Category::text, vId_Category::text);
  end loop;
  vCategories := null;
  
  --vTime := lib.console_log ('category 1', vTime);

  --  Contractors
  for r in (select c.Id_Contractor,
                   c.name,
                   c.note
              from cf$.Contractor c
             where c.Id_Project = iId_Project_From) 
  loop
    select c.Id_Contractor
      into vId_Contractor
      from cf$.Contractor c
     where c.Id_Project = iId_Project_To
       and upper(c.Name) = upper(r.Name);
     
    if vId_Contractor is null
    then 
      insert into cf$.Contractor (Id_Project, Name, Note)
           values (iId_Project_To, r.name, r.Note)
        returning Id_Contractor
             into vId_Contractor;
      Contractors_Count := Contractors_Count + 1;
    end if;
    vContractors_Map := vContractors_Map || hstore (r.Id_Contractor::text, vId_Contractor::text);
  end loop;
  --vTime := lib.console_log ('Contractors', vTime);
  
  
  -- Moneys
  for r in (select m.Id_Money,
                   m.name,
                   m.Symbol,
                   m.Id_Currency,
                   m.Is_Enabled
              from cf$.Money m
             where m.Id_Project = iId_Project_From) 
  loop
    select m.Id_Money
      into vId_Money
      from cf$.Money m
     where m.Id_Project = iId_Project_To
       and upper(m.Name) = upper(r.Name)
       and coalesce (m.Id_Currency, -1) = coalesce (r.Id_Currency, -1);
    
    if vId_Money is null
    then
      insert into cf$.money (Id_Project, Id_Currency, Name, Symbol, Is_Enabled)
           values (iId_Project_To, r.Id_Currency, r.name, r.Symbol, r.Is_Enabled)
        returning Id_Money
             into vId_Money;
      Moneys_Count := Moneys_Count + 1;
    end if;

    vMoneys_Map := vMoneys_Map || hstore (r.Id_Money::text, vId_Money::text);
  end loop;
--  vTime := lib.console_log ('all', vTime);

  for r in (select p.Id_Plan,
                   p.DBegin,
                   p.Report_Period,
                   p.Operation_Note,
                   p.Operation_Tags,
                   p.Repeat_Type,
                   p.Repeat_Days,
                   p.End_Type,
                   p.Repeat_Count,
                   p.DEnd,
                   p.Color_mark,
                   p.Note
              from cf$.Plan p
             where p.Id_Project = iId_Project_From)
  loop
    insert into cf$.Plan (Id_Project, DBegin, Report_Period, Operation_Note, 
                          Operation_Tags, 
                          Repeat_Type, Repeat_Days, End_Type, Repeat_Count, 
                          DEnd, Color_Mark, Note)
         values (iId_Project_To, r.DBegin, r.Report_Period, r.Operation_Note, 
                 array (select (vTags_Map->unnest(r.Operation_Tags)::text)::int), 
                 r.Repeat_Type, r.Repeat_Days, r.End_Type, r.Repeat_Count, 
                 r.DEnd, r.Color_Mark, r.Note)
      returning Id_Plan
           into vId_Plan;
    plans_Count := plans_Count + 1;
    vPlans_Map := vPlans_Map || hstore (r.Id_Plan::text, vId_Plan::text);
  end loop;

  insert into cf$.Plan_Cashflow_Item (Id_Project,
                                      Id_Plan, 
                                      Id_Contractor, 
                                      Id_Account,
                                      Id_Category, 
                                      Id_Money, 
                                      Id_Unit, 
                                      Sign, 
                                      Quantity, 
                                      Sum)
       select iId_Project_To,
              (vPlans_Map->pcfi.Id_Plan::text)::int,
              (vContractors_Map->pcfi.Id_Contractor::text)::int,
              (vAccounts_Map->pcfi.Id_Account::text)::int,
              (vCategories_Map->pcfi.Id_Category::text)::int, 
              (vMoneys_Map->pcfi.Id_Money::text)::int, 
              (vUnits_Map->pcfi.Id_Unit::text)::int,
              pcfi.Sign, 
              pcfi.Quantity, 
              pcfi.Sum
         from cf$.Plan_Cashflow_Item pcfi
        where pcfi.Id_Project = iId_Project_From;
   
  insert into cf$.Plan_Transfer (Id_Project,
                                 Id_Plan, 
                                 Id_Account_From, 
                                 Id_Account_To, 
                                 Sum,
                                 Id_Money, 
                                 Id_Account_Fee, 
                                 Fee, 
                                 Id_Money_Fee)
       select iId_Project_To,
              (vPlans_Map->pt.Id_Plan::text)::int,
              (vAccounts_Map->pt.Id_Account_From::text)::int,
              (vAccounts_Map->pt.Id_Account_To::text)::int,
              pt.Sum,
              (vMoneys_Map->pt.Id_Money::text)::int, 
              (vAccounts_Map->pt.Id_Account_Fee::text)::int,
              pt.Fee,
              (vMoneys_Map->pt.Id_Money_Fee::text)::int
         from cf$.Plan_Transfer pt
        where pt.Id_Project = iId_Project_From;

  insert into cf$.Plan_Exchange (Id_Project,
                                 Id_Plan, 
                                 Id_Account_From, 
                                 Sum_From, 
                                 Id_Money_From,
                                 Id_Account_To, 
                                 Sum_To, 
                                 Id_Money_To, 
                                 Id_Account_Fee, 
                                 Fee, 
                                 Id_Money_Fee)
       select iId_Project_To,
              (vPlans_Map->pe.Id_Plan::text)::int,
              (vAccounts_Map->pe.Id_Account_From::text)::int,
              pe.Sum_From,
              (vMoneys_Map->pe.Id_Money_From::text)::int, 
              (vAccounts_Map->pe.Id_Account_To::text)::int,
              pe.Sum_To,
              (vMoneys_Map->pe.Id_Money_To::text)::int, 
              (vAccounts_Map->pe.Id_Account_Fee::text)::int,
              pe.Fee,
              (vMoneys_Map->pe.Id_Money_Fee::text)::int
         from cf$.Plan_Exchange pe
        where pe.Id_Project = iId_Project_From;

  insert into cf$.Plan_Exclude (Id_Project, Id_Plan, DExclude, Action_Type)
       select iId_Project_To, (vPlans_Map->pe.Id_Plan::text)::int, pe.DExclude, pe.Action_Type
         from cf$.Plan_Exclude pe
        where pe.Id_Project = iId_Project_From;
  
  for r in (with 
              ctx as (select context.get('Id_User')::int as Id_User),
              cfd as (select cfdi.Id_CashFlow
                        from      cf$_account.permit(iId_Project_From) p 
                             join cf$.cashflow_detail cfdi using (id_Project, id_Account)
                     )
            select cf.Id_Project,
                   cf.Id_CashFlow,
                   cf.Id_Contractor,
                   cf.Id_CashFlow_Type,
                   cf.note,
                   cf.tags
              from ctx, cf$.CashFlow cf
             where (   cf.Id_User = ctx.Id_User
                    or (exists (select null
                                  from cfd
                                 where cfd.id_cashflow = cf.id_cashflow
                                 limit 1)))
               and cf.Id_Project = iId_Project_From
           )
  loop
    insert into cf$.CashFlow (Id_Project, 
                              Id_Contractor,
                              Id_CashFlow_Type,
                              note,
                              Tags)
         values (iId_Project_To,
                 (vContractors_Map->r.Id_Contractor::text)::int,
                 r.Id_CashFlow_Type,
                 r.Note,
                 array (select (vTags_Map->unnest(r.Tags)::text)::int))
      returning Id_CashFlow
           into vId_CashFlow;
    CashFlows_Count := CashFlows_Count + 1;

    with 
      ins as (insert into cf$.CashFlow_Detail (Id_Project,
                                               Id_CashFlow, 
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
          (select iId_Project_To,
                  vId_CashFlow,
                  (vAccounts_Map->cfd.Id_Account::text)::int,
                  (vCategories_Map->cfd.Id_Category::text)::int, 
                  (vMoneys_Map->cfd.Id_Money::text)::int, 
                  (vUnits_Map->cfd.Id_Unit::text)::int,
                  cfd.sign,
                  cfd.dcashflow_detail,
                  cfd.report_period,
                  cfd.quantity,
                  cfd.sum,
                  cfd.Is_Not_Confirmed,
                  cfd.note,
                  array (select (vTags_Map->unnest(cfd.Tags)::text)::int)
             from      cf$.cashflow_detail cfd 
                  join cf$_account.permit(iId_Project_From) p using (Id_Project, Id_Account)
            where cfd.Id_Project = r.Id_Project
              and cfd.Id_CashFlow = r.Id_CashFlow)
        returning *)
    select count(*) + CashFlow_Details_Count
      into CashFlow_Details_Count
      from ins;
  --vTime := lib.console_log ('all', vTime);

  end loop;

  --vTime := lib.console_log ('cf', vTime);
  -- perform context.set('Id_Project', vPrev_Id_Project, false);
end;
$function$
