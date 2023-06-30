CREATE OR REPLACE FUNCTION "cf$_project".copy(iid_project_from integer, iid_project_to integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vId_Tag        cf$.tag.Id_Tag%type;
  vTags_Map        hstore := ''::hstore;
  r  record;
begin
  perform context.set('isNotCheckPermit', '1');

  -- Tags
  for r in (select t.*
              from cf$.Tag t
             where t.Id_Project = iId_Project_From)
  loop
    -- Id_Tag нельзя использовать старый, т.к. он глобальный
    insert into cf$.Tag (Id_Project, /*Id_Tag,*/ Id_User, Name)
         values (iId_Project_To, /*r.Id_Tag,*/ r.Id_User, r.name)
      returning Id_Tag
           into vId_Tag;

    vTags_Map := vTags_Map || hstore (r.Id_Tag::text, vId_Tag::text);
  end loop;

  -- Units
  insert into cf$.Unit (Id_Project, Id_Unit, Id_User, Name)
       select iId_Project_To, u.Id_Unit, u.Id_User, u.name
         from cf$.Unit u
        where u.Id_Project = iId_Project_From;

  -- Accounts
  insert into cf$.Account (Id_Project, Id_Account, Id_User, Id_Account_Type, name, Is_Enabled, note)
       select iId_Project_To, a.Id_Account, a.Id_User, a.Id_Account_Type, a.name, a.Is_Enabled, a.note
         from cf$.Account a
        where a.Id_Project = iId_Project_From;

  -- Account Permits
  insert into cf$.Account_Permit (Id_Project, Id_Account, Id_User, Permit)
       select iId_Project_To, ap.Id_Account, ap.Id_User, ap.Permit
         from cf$.Account_Permit ap
        where ap.Id_Project = iId_Project_From;

  insert into cf$.Category (Id_Project, Id_Category, Id_User, Parent, Id_Unit, Name, Is_Enabled, Is_System, Note, Id_Category_Prototype)
       select iId_Project_To, c.Id_Category, c.Id_User, c.Parent, c.Id_Unit, c.Name, c.Is_Enabled, c.Is_System, c.Note, c.Id_Category_Prototype
         from cf$.Category c
        where c.Id_Project = iId_Project_From;

  --  Contractors
  insert into cf$.Contractor (Id_Project, Id_Contractor, Id_User, Name, Note)
       select iId_Project_To, c.Id_Contractor, c.Id_User, c.Name, c.Note
         from cf$.Contractor c
        where c.Id_Project = iId_Project_From;

  -- Moneys
  insert into cf$.Money (Id_Project, Id_Money, Id_User, Name, Symbol, Is_Enabled, Sorting, precision, currency_code)
       select iId_Project_To, m.Id_Money, m.Id_User, m.Name, m.Symbol, m.Is_Enabled, m.Sorting, m.precision, m.currency_code
         from cf$.Money m
        where m.Id_Project = iId_Project_From;

  insert into cf$.Money_Rate (Id_Project, Id_Money_Rate, Id_User, Id_Money, DRate, Id_Currency, Rate)
       select iId_Project_To, mr.Id_Money_Rate, mr.Id_User, mr.Id_Money, mr.DRate, mr.Id_Currency, mr.Rate
         from cf$.Money_Rate mr
        where mr.Id_Project = iId_Project_From;

  insert into cf$.CashFlow (Id_Project, Id_CashFlow, Id_User, Id_CashFlow_Type, Id_Contractor, Note, Tags, DSet)
       select iId_Project_To, cf.Id_CashFlow, cf.Id_User, cf.Id_CashFlow_Type, cf.Id_Contractor, cf.Note, array (select (vTags_Map->unnest(cf.Tags)::text)::int), cf.DSet
         from cf$.CashFlow cf
        where cf.Id_Project = iId_Project_From;

  insert into cf$.Plan (Id_Project, Id_Plan, Id_User, DBegin, Report_Period,
                        Operation_Note, Operation_Tags, Repeat_Type, Repeat_Days,
                        End_Type, Repeat_Count, DEnd, Color_Mark, Note)
       select iId_Project_To, p.Id_Plan, p.Id_User, p.DBegin, p.Report_Period,
              p.Operation_Note, array (select (vTags_Map->unnest(p.Operation_Tags)::text)::int), p.Repeat_Type, p.Repeat_Days,
              p.End_Type, p.Repeat_Count, p.DEnd, p.Color_Mark, p.Note
         from cf$.Plan p
        where p.Id_Project = iId_Project_From;

  insert into cf$.Plan_Cashflow_Item (id_project, id_plan, id_contractor, id_account,
                                      id_category, id_money, id_unit, sign, quantity, sum)
       select iId_Project_To, pcfi.Id_Plan, pcfi.Id_Contractor, pcfi.Id_Account,
              pcfi.Id_Category, pcfi.Id_Money, pcfi.Id_Unit, pcfi.Sign, pcfi.Quantity, pcfi.Sum
         from cf$.Plan_Cashflow_Item pcfi
        where pcfi.Id_Project = iId_Project_From;

  insert into cf$.Plan_Transfer (Id_Project, Id_Plan, Id_Account_From, Id_Account_To, Sum,
                                 Id_Money, Id_Account_Fee, Fee, Id_Money_Fee)
       select iId_Project_To, pt.Id_Plan, pt.Id_Account_From, pt.Id_Account_To, pt.Sum,
              pt.Id_Money, pt.Id_Account_Fee, pt.Fee, pt.Id_Money_Fee
         from cf$.Plan_Transfer pt
        where pt.Id_Project = iId_Project_From;

  insert into cf$.Plan_Exchange (Id_Project, Id_Plan, Id_Account_From, Sum_From, Id_Money_From,
                                 Id_Account_To, Sum_To, Id_Money_To, Id_Account_Fee, Fee, Id_Money_Fee)
       select iId_Project_To, pe.Id_Plan, pe.Id_Account_From, pe.Sum_From, pe.Id_Money_From,
              pe.Id_Account_To, pe.Sum_To, pe.Id_Money_To, pe.Id_Account_Fee, pe.Fee, pe.Id_Money_Fee
         from cf$.Plan_Exchange pe
        where pe.Id_Project = iId_Project_From;

  insert into cf$.Plan_Exclude (Id_Project, Id_Plan, Id_User, DExclude, Action_Type)
       select iId_Project_To, pe.Id_Plan, pe.Id_User, pe.DExclude, pe.Action_Type
         from cf$.Plan_Exclude pe
        where pe.Id_Project = iId_Project_From;

  perform context.set('isNotCalculateBalance', '1');

  insert into cf$.CashFlow_Detail (Id_Project, Id_CashFlow, Id_CashFlow_Detail,
                                   Id_User, Id_Account, Id_Category,
                                   Id_Money, Id_Unit, Sign,
                                   DCashflow_Detail, Report_Period, Quantity,
                                   Sum, Is_Not_Confirmed, Note,
                                   Tags)
       select iId_Project_To, cfd.Id_CashFlow, cfd.Id_CashFlow_Detail,
              cfd.Id_User, cfd.Id_Account, cfd.Id_Category,
              cfd.Id_Money, cfd.Id_Unit, cfd.Sign,
              cfd.DCashflow_Detail, cfd.Report_Period, cfd.Quantity,
              cfd.Sum, cfd.Is_Not_Confirmed, cfd.Note,
              array (select (vTags_Map->unnest(cfd.Tags)::text)::int)
         from cf$.CashFlow_Detail cfd
        where cfd.Id_Project = iId_Project_From;

  perform context.set('isNotCalculateBalance', '');

  insert into cf$.Account_Balance (Id_Project, Id_Account, Id_Money, DBalance, Sum_In, Sum_Out)
       select iId_Project_To, Id_Account, Id_Money, DBalance, Sum_In, Sum_Out
        from cf$.Account_Balance ab
       where ab.Id_Project = iId_Project_From;

  perform context.set('isNotCheckPermit', '');
end;
$function$
