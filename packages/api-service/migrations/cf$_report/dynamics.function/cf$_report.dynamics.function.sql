CREATE OR REPLACE FUNCTION "cf$_report".dynamics(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER COST 1000
AS $function$
declare
  vLevel    int;
  vCategory hstore;  
  
  vDBegin                   date;
  vDEnd                     date;
  vIs_Use_Report_Period     boolean;
  vIs_Use_Plan              boolean;
  vId_Money                 int;
  vContractors_Using_Type   int;
  vContractors              int[];
  vAccounts_Using_Type      int;
  vAccounts                 int[];
  vCategories_Using_Type    int;
  vCategories               int[];
  vTags_Using_Type          int;
  vTags                     int[];
  
begin
  begin
    vDBegin := sanitize$.to_Date (iParams->>'dBegin');
  exception
    when others then
      perform error$.raise ('invalid_parameters', iDev_Message := '"dBegin" must be a date');
  end;

  if vDBegin is null then
    perform error$.raise ('invalid_parameters', iDev_Message := '"dBegin" is required');
  end if;

  begin
    vDEnd := sanitize$.to_date (iParams->>'dEnd');
  exception
    when others then
      perform error$.raise ('invalid_parameters', iDev_Message := '"dEnd" must be a date');
  end;

  if vDEnd is null then
    perform error$.raise ('invalid_parameters', iDev_Message := '"dEnd" is required');
  end if;
  
  if vDBegin > vDEnd then
    perform error$.raise ('invalid_parameters', iDev_Message := '"dBegin" must be less than "dEnd"');
  end if;

  begin
    vIs_Use_Report_Period := coalesce ((iParams->>'isUseReportPeriod')::boolean, true);
  exception
    when others then
      perform error$.raise ('invalid_parameters', iDev_Message := '"isUseReportPeriod" must be true or false');
  end;

  begin
    vIs_Use_Plan := coalesce ((iParams->>'isUsePlan')::boolean, true);
  exception
    when others 
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"isUsePlan" must be true or false');
  end;

  begin
    vId_Money := (iParams->>'idMoney')::int;
  exception
    when others then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idMoney" must be a number');
  end;

  if vId_Money is null then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idMoney" is required');
  end if;
  

  begin
    vContractors_Using_Type := coalesce((iParams->>'contractorsUsingType')::int, 1);
  exception
    when others then
      perform error$.raise ('invalid_parameters', iDev_Message := '"contractorsUsingType" must be a int');
  end;
  
  if (iParams \? 'contractors') then
    begin
      vContractors := string_to_array (nullif ( trim (iParams->>'contractors'), ''), ',')::int[];
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"contractors" must be a list of integer');
    end;
  end if;

  begin
    vAccounts_Using_Type := coalesce((iParams->>'accountsUsingType')::int, 1);
  exception
    when others then
      perform error$.raise ('invalid_parameters', iDev_Message := '"accountsUsingType" must be a int');
  end;

  if (iParams \? 'accounts') then
    begin
      vAccounts := string_to_array (nullif (trim (iParams->>'accounts'), ''), ',')::int[];
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"accounts" must be a list of integer');
    end;
  end if;

  begin
    vCategories_Using_Type := coalesce ((iParams->>'categoriesUsingType')::int, 1);
  exception
    when others then
      perform error$.raise ('invalid_parameters', iDev_Message := '"categoriesUsingType" must be a int');
  end;

  if (iParams \? 'categories') then
    begin
      vCategories := string_to_array (nullif (trim (iParams->>'categories'), ''), ',')::int[];
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"categories" must be a list of integer');
    end;
  end if;

  begin
    vTags_Using_Type := coalesce((iParams->>'tagsUsingType')::int, 1);
  exception
    when others then
      perform error$.raise ('invalid_parameters', iDev_Message := '"tagsUsingType" must be a int');
  end;

  if (iParams \? 'tags') then
    begin
      vtags := string_to_array (nullif (trim (iParams->>'tags'), ''), ',')::int[];
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"tags" must be a list of integer');
    end;
  end if;

  create temporary table cf$_report_dynamics
  (
    id_category integer,
    parent      integer,
    month       integer,
    sum_in      numeric,
    sum_out     numeric,
    level       smallint
  ) 
  on commit drop;
   
  -- Кешируем уровни категорий
  with recursive 
    ct as (select c.Id_Category, 
                  c.Parent,
                  1 as level   
             from cf$.v_Category c
            where c.parent is null
            union all
            select c.Id_Category, 
                   c.Parent, 
                   ct.level + 1 
              from      ct 
                   join cf$.v_Category c 
                     on (c.Parent = ct.Id_Category)
          )
  select coalesce (hstore (array_agg (ct.Id_Category::text order by ct.Id_Category), 
                           array_agg (ct.Level::text order by ct.Id_Category)), ''::hstore)
    into vCategory
    from ct;

  insert into cf$_report_dynamics (Id_Category, Parent, level, month, Sum_In, Sum_Out)
    with recursive 
      ct (Id_Category) as (select c.Id_Category
                             from cf$.v_Category c
                            where vCategories is not null
                              and c.Id_Category in (select unnest (vCategories))
                            union all
                           select c.Id_Category
                             from ct, cf$.v_Category c
                            where c.Parent = ct.Id_Category
                          ),
      ctx as (select cf$_Category.get_Category_by_Prototype(11) as Id_Category_Transfer,
                     cf$_Category.get_Category_by_Prototype(12) as Id_Category_Transfer_Fee,
                     cf$_category.get_Category_by_Prototype(21) as Id_Category_Exchange,
                     cf$_category.get_Category_by_Prototype(22) as Id_Category_Exchange_Fee
      ),                          
      cfi as (select cfd.Id_Project,
                     cf.Id_Contractor,
                     cfd.Id_Account,
                     cfd.Id_Money,
                     cfd.Id_Category,
                     cfd.DCashFlow_Detail,
                     cfd.Report_Period,
                     cfd.Sign,
                     cfd.Sum,
                     cfd.Tags
                from      cf$.v_CashFlow_Detail cfd
                     join cf$.CashFlow cf using (Id_Project, Id_CashFlow)
               union all
              select pcfi.Id_Project,
                     pcfi.Id_Contractor,
                     pcfi.Id_Account,
                     pcfi.Id_Money,
                     pcfi.Id_Category,
                     s.DPlan as DCashFlow_Detail,
                     s.Report_Period,
                     pcfi.Sign,
                     pcfi.Sum,
                     pcfi.Operation_Tags as Tags
                from  cf$.v_Plan_CashFlow_Item pcfi
--                      делаю +1 месяц для подстаховки, если вдруг отчет будет по отчетному месяцу, 
--                      а он будет +1 месяц относительно даты 
                     join cf$_plan.schedule(pcfi.Id_Plan, pcfi.DBegin, (vDEnd + interval '1 month')::date) s on (1=1)
               where vIs_Use_Plan
               union all
              select pt.Id_Project,
                     null::int as Id_Contractor,
                     pt.Id_Account_From as Id_Account,
                     pt.Id_Money,
                     ctx.Id_Category_Transfer as Id_Category,
                     s.DPlan as DCashFlow_Detail,
                     s.Report_Period,
                     -1 as Sign,
                     pt.Sum,
                     pt.Operation_Tags as Tags
                from ctx,
                     cf$.v_Plan_Transfer pt,
--                      делаю +1 месяц для подстаховки, если вдруг отчет будет по отчетному месяцу, 
--                      а он будет +1 месяц относительно даты 
                     cf$_plan.schedule(pt.Id_Plan, pt.DBegin, (vDEnd + interval '1 month')::date) s
               where vIs_Use_Plan
               union all
              select pt.Id_Project,
                     null::int as Id_Contractor,
                     pt.Id_Account_To as Id_Account,
                     pt.Id_Money,
                     ctx.Id_Category_Transfer as Id_Category,
                     s.DPlan as DCashFlow_Detail,
                     s.Report_Period,
                     1 as Sign,
                     pt.Sum,
                     pt.Operation_Tags as Tags
                from ctx,
                     cf$.v_Plan_Transfer pt,
--                      делаю +1 месяц для подстаховки, если вдруг отчет будет по отчетному месяцу, 
--                      а он будет +1 месяц относительно даты 
                     cf$_plan.schedule(pt.Id_Plan, pt.DBegin, (vDEnd + interval '1 month')::date) s
               where vIs_Use_Plan
               union all
              select pt.Id_Project,
                     null::int as Id_Contractor,
                     pt.Id_Account_Fee as Id_Account,
                     pt.Id_Money_Fee as Id_Money,
                     ctx.Id_Category_Transfer_Fee as Id_Category,
                     s.DPlan as DCashFlow_Detail,
                     s.Report_Period,
                     -1 as Sign,
                     pt.Fee,
                     pt.Operation_Tags as Tags
                from ctx,
                     cf$.v_Plan_Transfer pt,
--                      делаю +1 месяц для подстаховки, если вдруг отчет будет по отчетному месяцу, 
--                      а он будет +1 месяц относительно даты 
                     cf$_plan.schedule(pt.Id_Plan, pt.DBegin, (vDEnd + interval '1 month')::date) s
               where pt.Id_Account_Fee is not null
                 and vIs_Use_Plan
               union all
              --
              select pe.Id_Project,
                     null::int as Id_Contractor,
                     pe.Id_Account_From as Id_Account,
                     pe.Id_Money_From as Id_Money,
                     ctx.Id_Category_Exchange as Id_Category,
                     s.DPlan as DCashFlow_Detail,
                     s.Report_Period,
                     -1 as Sign,
                     pe.Sum_From as Sum,
                     pe.Operation_Tags as Tags
                from ctx,
                     cf$.v_Plan_Exchange pe,
--                      делаю +1 месяц для подстаховки, если вдруг отчет будет по отчетному месяцу, 
--                      а он будет +1 месяц относительно даты 
                     cf$_plan.schedule(pe.Id_Plan, pe.DBegin, (vDEnd + interval '1 month')::date) s
               where vIs_Use_Plan
               union all
              select pe.Id_Project,
                     null::int as Id_Contractor,
                     pe.Id_Account_To as Id_Account,
                     pe.Id_Money_To as Id_Money,
                     ctx.Id_Category_Exchange as Id_Category,
                     s.DPlan as DCashFlow_Detail,
                     s.Report_Period,
                     1 as Sign,
                     pe.Sum_To as Sum,
                     pe.Operation_Tags as Tags
                from ctx,
                     cf$.v_Plan_Exchange pe,
--                      делаю +1 месяц для подстаховки, если вдруг отчет будет по отчетному месяцу, 
--                      а он будет +1 месяц относительно даты 
                     cf$_plan.schedule(pe.Id_Plan, pe.DBegin, (vDEnd + interval '1 month')::date) s
               where vIs_Use_Plan
               union all
              select pe.Id_Project,
                     null::int as Id_Contractor,
                     pe.Id_Account_Fee as Id_Account,
                     pe.Id_Money_Fee as Id_Money,
                     ctx.Id_Category_Exchange_Fee as Id_Category,
                     s.DPlan as DCashFlow_Detail,
                     s.Report_Period,
                     -1 as Sign,
                     pe.Fee as Sum,
                     pe.Operation_Tags as Tags
                from ctx,
                     cf$.v_Plan_Exchange pe,
--                      делаю +1 месяц для подстаховки, если вдруг отчет будет по отчетному месяцу, 
--                      а он будет +1 месяц относительно даты 
                     cf$_plan.schedule(pe.Id_Plan, pe.DBegin, (vDEnd + interval '1 month')::date) s
               where pe.Id_Account_Fee is not null
                 and vIs_Use_Plan
             )                          
    select c.Id_Category, 
           c.Parent, 
           (vCategory->c.Id_Category::text)::int,
           to_char (case 
                      when vIs_Use_Report_Period 
                      then
                   	    cfi.Report_Period
                      else
                        date_trunc('month', cfi.DCashFlow_Detail)
                    end, 'yyyymm')::int as Month,
           sum (case when cfi.Sign = 1 then cfi.Sum else 0 end) as Sum_In,
           sum (case when cfi.Sign = -1 then cfi.Sum else 0 end) as Sum_Out
      from      cfi
           join cf$.Category c using (Id_Project, Id_Category)
     where (   (vIs_Use_Report_Period = false and cfi.DCashFlow_Detail between vDBegin and vDEnd)
            or (vIs_Use_Report_Period = true and cfi.Report_Period between date_trunc('month', vDBegin) and date_trunc('month', vDEnd))
           )      
       and cfi.Id_Money = vId_Money
       and (   vContractors is null 
            or (   (vContractors_Using_Type = 1 and cfi.Id_Contractor in (select unnest (vContractors)))
                or (vContractors_Using_Type = 2 and (cfi.Id_Contractor is null or cfi.Id_Contractor not in (select unnest (vContractors))))
               )
           )
       and (   vAccounts is null 
            or (   (vAccounts_Using_Type = 1 and cfi.Id_Account in (select unnest (vAccounts)))
                or (vAccounts_Using_Type = 2 and cfi.Id_Account not in (select unnest (vAccounts)))
               )
           )    
       and (   vCategories is null 
            or (   (vCategories_Using_Type = 1 and cfi.Id_Category in (select Id_Category from ct))
                or (vCategories_Using_Type = 2 and cfi.Id_Category not in (select Id_Category from ct))
               )
           )
       and (   vTags is null 
            or (   (vTags_Using_Type = 1 and cfi.tags && vTags)
                or (vTags_Using_Type = 2 and (cfi.tags is null or not cfi.tags && vTags))
               )
           )
     group by c.Id_Category, 
              c.Parent, 
              case when vIs_Use_Report_Period then 
              	cfi.Report_Period
              else
                date_trunc('month', cfi.DCashFlow_Detail)
              end;
  

  create index cf$_report_dynamics_parent ON cf$_report_dynamics
    using btree (parent);
  
  -- если есть движение по категории и по ее подкатегории, 
  -- то в категорию добавляем подкатегорию "Другое" и переносим движение по категории в эту подкатегорию.
  with 
    d as (select d.Id_Category,
                 d.month,
                 d.Sum_In,
                 d.Sum_Out
            from cf$_report_dynamics d
           where exists (select null 
                           from cf$_report_dynamics di
                          where di.parent = d.Id_Category
--                               and di.month = d.month
                         )),
       ins as (insert 
                 into cf$_report_dynamics (id_Category, Parent, level, month, Sum_In, Sum_Out)
              (select null, -- Подкатегория "Другое"
                      Id_Category, 
                      (vCategory->Id_Category::text)::int + 1,
                      month,  
                      Sum_In,
                      Sum_Out 
                 from d)
          returning parent, month)
  update cf$_report_dynamics d 
     set Sum_In = null,
         Sum_Out = null
   from ins
  where d.Id_Category = ins.Parent
    and d.Month = ins.Month;

  select coalesce(max(level), 0)
    into vLevel
    from cf$_report_dynamics d;

  for i in reverse vLevel .. 2 loop
    with g as (select d.Parent, d.Month, sum(d.Sum_In) as Sum_In, sum(d.Sum_Out) as Sum_Out
                 from cf$_report_dynamics d
                where level = i
                group by d.Parent, d.month),
         s as (select c.Id_Category, c.Parent, g.Month, g.Sum_In,  g.Sum_Out
                 from g 
                      join cf$.v_Category c
                        on (c.Id_Category = g.Parent)
              ),
         upsert as (update cf$_report_dynamics d 
                       set Sum_In = s.Sum_In,
                           Sum_Out = s.Sum_Out
                      from s 
                     where d.Id_Category = s.Id_Category
                       and d.month = s.Month
                 returning d.*
                   )
    insert into cf$_report_dynamics (Id_Category, Parent, level, Month, Sum_In, Sum_Out)
         select s.Id_Category, 
                s.Parent,
                i - 1 as level,
                s.Month,
                s.Sum_In,
                s.Sum_Out
           from s 
          where (Id_Category, Month) not in (select Id_Category, 
                                                     Month
                                                from upsert);
  end loop;

  oResult := concat ('"items":[', cf$_report.dynamics_built_result (null), ']');

end;
$function$
