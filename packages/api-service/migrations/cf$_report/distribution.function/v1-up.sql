CREATE OR REPLACE FUNCTION "cf$_report".distribution(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER COST 1000
AS $function$
declare
  vLevel  int;
  vCategory   hstore;

  vDBegin                 date;
  vDEnd                   date;
  vIs_Use_Report_Period   boolean;
  vId_Money               int;
  vContractors_Using_Type int;
  vContractors            int[];
  vAccounts_Using_Type    int;
  vAccounts               int[];
  vCategories_Using_Type  int;
  vCategories             int[];
  vTags_Using_Type        int;
  vTags                   int[];
begin
  begin
    vDBegin := sanitize$.to_date (iParams->>'dBegin');
  exception
    when others
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"dBegin" must be a date');
  end;

  if vDBegin is null
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"dBegin" is required');
  end if;

  begin
    vDEnd := sanitize$.to_date (iParams->>'dEnd');
  exception
    when others
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"dEnd" must be a date');
  end;

  if vDEnd is null
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"dEnd" is required');
  end if;

  if vDBegin > vDEnd
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"dBegin" must be less than "dEnd"');
  end if;

  begin
    vIs_Use_Report_Period := coalesce ((iParams->>'isUseReportPeriod')::boolean, true);
  exception
    when others
    then
      perform error$.raise ('invalid_parameters', iDev_Message := '"isUseReportPeriod" must be true or false');
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
      vContractors := string_to_array(nullif(iParams->>'contractors', ''), ',')::int[];
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
      vAccounts := string_to_array (nullif (iParams->>'accounts', ''), ',')::int[];
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"accounts" must be a list of integer');
    end;
  end if;

  begin
    vCategories_Using_Type := coalesce((iParams->>'categoriesUsingType')::int, 1);
  exception
    when others then
      perform error$.raise ('invalid_parameters', iDev_Message := '"categoriesUsingType" must be a int');
  end;

  if (iParams \? 'categories') then
    begin
      vCategories := string_to_array(nullif(iParams->>'categories', ''), ',')::int[];
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
      vTags := string_to_array (nullif (iParams->>'tags', ''), ',')::int[];
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"tags" must be a list of integer');
    end;
  end if;

  create temporary table cf$_report_distribution
  (
    id_category integer,
    parent      integer,
    sum_in      numeric,
    sum_out     numeric,
    level       smallint
  )
  on commit drop;

  -- Кешируем уровни статей
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
  select coalesce (hstore(array_agg (ct.Id_Category::text order by ct.Id_Category),
                          array_agg (ct.Level::text order by ct.Id_Category)), ''::hstore)
    into vCategory
    from ct;

  insert into cf$_report_distribution (Id_Category, Parent, level, Sum_In, Sum_Out)
    with recursive
      ct (Id_Category) as (select c.Id_Category, c.Parent
                             from cf$.v_Category c
                            where vCategories is not null
                              and c.Id_Category in (select unnest (vCategories))
                            union all
                           select c.Id_Category, c.Parent
                             from ct, cf$.v_Category c
                            where c.Parent = ct.Id_Category
                          )
    select coalesce(c.Id_Category, 0),
           c.Parent,
           (vCategory->c.Id_Category::text)::int,
           sum (case when cfd.Sign = 1 then cfd.Sum else 0 end) as Sum_In,
           sum (case when cfd.Sign = -1 then cfd.Sum else 0 end) as Sum_Out
      from cf$.v_CashFlow_Detail cfd
           left join cf$.Category c using (Id_Project, Id_Category)
           join cf$.CashFlow cf using (Id_Project, Id_CashFlow)
     where (   (vIs_Use_Report_Period = false and cfd.DCashFlow_Detail between vDBegin and vDEnd)
            or (vIs_Use_Report_Period = true and cfd.Report_Period between date_trunc('month', vDBegin) and date_trunc('month', vDEnd))
           )
       and cfd.Id_Money = vId_Money
       and (   vContractors is null
            or (   (vContractors_Using_Type = 1 and cf.Id_Contractor in (select unnest (vContractors)))
                or (vContractors_Using_Type = 2 and (cf.Id_Contractor is null or cf.Id_Contractor not in (select unnest (vContractors))))
               )
           )
       and (   vAccounts is null
            or (   (vAccounts_Using_Type = 1 and cfd.Id_Account in (select unnest (vAccounts)))
                or (vAccounts_Using_Type = 2 and cfd.Id_Account not in (select unnest (vAccounts)))
               )
           )
       and (   vCategories is null
            or cfd.id_category is null
            or (   (vCategories_Using_Type = 1 and cfd.Id_Category in (select Id_Category from ct))
                or (vCategories_Using_Type = 2 and cfd.Id_Category not in (select Id_Category from ct))
               )
           )
       and (   vTags is null
            or (   (vTags_Using_Type = 1 and cfd.tags && vTags)
                or (vTags_Using_Type = 2 and (cfd.tags is null or not cfd.tags && vTags))
               )
           )
     group by c.Id_Category,
              c.Parent;

/*  create index cf$_report_dynamics_parent ON cf$_report_dynamics
    using btree (parent);
*/
  -- если есть движение по категории и по ее подкатегории,
  -- то в категорию добавляем подкатегорию "Другое" и переносим движение по категории в эту подкатегорию.
  with
    d as (select d.Id_Category,
                 d.Sum_In,
                 d.Sum_Out
            from cf$_report_distribution d
           where exists (select null
                           from cf$_report_distribution di
                          where di.parent = d.Id_Category
                        )),
    ins as (insert into cf$_report_distribution (id_Category, Parent, level, Sum_In, Sum_Out)
                        (select null, -- Подкатегория "Другое"
                                Id_Category,
                                (vCategory->Id_Category::text)::int + 1,
                                Sum_In,
                                Sum_Out
                           from d)
              returning parent)
  update cf$_report_distribution d
     set Sum_In = null,
         Sum_Out = null
   from ins
  where d.Id_Category = ins.Parent;

  select coalesce (max (level), 0)
    into vLevel
    from cf$_report_distribution d;

  for i in reverse vLevel .. 2 loop
    with g as (select d.Parent, sum(d.Sum_In) as Sum_In, sum(d.Sum_Out) as Sum_Out
                 from cf$_report_distribution d
                where level = i
                group by d.Parent),
         s as (select c.Id_Category, c.Parent, g.Sum_In,  g.Sum_Out
                 from g
                      join cf$.v_Category c
                        on (c.Id_Category = g.Parent)
              ),
         upsert as (update cf$_report_distribution d
                       set Sum_In = s.Sum_In,
                           Sum_Out = s.Sum_Out
                      from s
                     where d.Id_Category = s.Id_Category
                 returning d.*
                   )
    insert into cf$_report_distribution (Id_Category, Parent, level, Sum_In, Sum_Out)
         select s.Id_Category,
                s.Parent,
                i - 1 as level,
                s.Sum_In,
                s.Sum_Out
           from s
          where Id_Category not in (select Id_Category
                                           from upsert);
  end loop;

  oResult := concat ('"items":[', cf$_report.distribution_built_result (null), ']');
end;
$function$
