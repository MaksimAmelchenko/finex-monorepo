CREATE OR REPLACE FUNCTION "cf$_report"."#dynamics_multi_currencies"(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER COST 1000
AS $function$
declare
  r       record;
  vLevel  int;

  vCashFlow_Item   hstore;
begin
/*
  delete 
    from cf$_report.dynamics1;

  -- Кешируем уровни статей
  with recursive cfit as (select cf.Id_CashFlow_Item, 
                                 cf.Parent,
                                 1 as level   
                            from cf$.v_CashFlow_Item cf 
                           where cf.parent is null
                           union 
                          select cfi.Id_CashFlow_Item, 
                                 cfi.Parent, 
                                 cfit.level + 1 
                            from cfit 
                                 join cf$.v_CashFlow_Item cfi 
                                   on (cfi.Parent = cfit.Id_CashFlow_Item)
                        )
  select coalesce (hstore(array_agg(cfit.Id_CashFlow_Item::text order by cfit.Id_CashFlow_Item), 
                          array_agg(cfit.Level::text order by cfit.Id_CashFlow_Item)), ''::hstore)
    into vCashFlow_Item
    from cfit;

  insert into cf$_report.dynamics1 (id_CashFlow_Item, Parent, level, month, id_Currency, Summa)
       select cfd.Id_CashFlow_Item, 
              cfi.Parent, 
              (vCashFlow_Item->cfd.Id_CashFlow_Item::text)::int,
              to_char(date_trunc('month', cfd.DCashFlow_Detail), 'yyyymm')::int as Month, 
              cfd.id_Currency,
              sum (cfd.Sign * cfd.Summa) as Summa
         from cf$.v_CashFlow_Detail cfd
              join cf$.CashFlow_Item cfi 
                on (cfi.Id_CashFlow_Item = cfd.Id_CashFlow_Item)
--        where cfd.DCashFlow_Detail between to_date('01.01.2013', 'dd.mm.yyyy') and to_date('31.12.2013', 'dd.mm.yyyy')
        group by cfd.Id_CashFlow_Item, 
                 cfi.Parent, 
                 date_trunc('month', cfd.DCashFlow_Detail),
                 cfd.Id_Currency;
  
  -- если есть движение по категории и по ее подкатегории, 
  -- то в категорию добавляем подкатегорию "Другое" и переносим движение по категории в эту подкатегорию.

  with d as (select d.Id_CashFlow_Item,
                    d.month,
                    d.Id_Currency,
                    d.Summa
               from cf$_report.dynamics1 d
              where exists (select null 
                              from cf$_report.dynamics1 di
                             where di.parent = d.Id_CashFlow_Item
                               and di.month = d.month
                               and di.Id_Currency = d.Id_Currency
                           )),
       ins as (insert 
                 into cf$_report.dynamics1 (id_CashFlow_Item, Parent, level, month, id_Currency, Summa)
              (select null, -- Подкатегорию "Другое"
                      Id_CashFlow_Item, 
                      (vCashFlow_Item->Id_CashFlow_Item::text)::int + 1,
                      month,  
                      id_Currency, 
                      Summa 
                 from d)
          returning parent, month, Id_Currency)
  update cf$_report.dynamics1 d 
     set summa = null
   from ins
  where d.Id_CashFlow_Item = ins.Parent
    and d.Month = ins.Month
    and d.Id_Currency = ins.Id_Currency;

  select max(level)
    into vLevel
    from cf$_report.dynamics1 d;

  for i in reverse vLevel .. 2 loop
    with g as (select d.Parent, d.Month, d.Id_Currency, sum(d.Summa) as Summa
                 from cf$_report.dynamics1 d
                where level = i
                group by d.Parent, d.month, d.Id_Currency),
         s as (select cfi.Id_CashFlow_Item, cfi.Parent, g.Month, g.Id_Currency, g.Summa
                 from g 
                      join cf$.v_CashFlow_Item cfi
                        on (cfi.Id_CashFlow_Item = g.Parent)
              ),
         upsert as (update cf$_report.dynamics1 d 
                       set summa = s.Summa
                      from s 
                     where d.Id_CashFlow_Item = s.Id_CashFlow_Item
                       and d.month = s.Month
                       and d.Id_Currency = s.Id_Currency
                 returning d.*
                   )
    insert into cf$_report.dynamics1 (Id_cashFlow_Item, Parent, level, Month, Id_Currency, Summa)
         select s.Id_CashFlow_Item, 
                s.Parent,
                i - 1 as level,
                s.Month,
                s.Id_Currency,
                s.Summa
           from s 
          where (Id_CashFlow_Item, Month, Id_Currency) not in (select Id_CashFlow_Item, 
                                                                      Month, 
                                                                      Id_Currency 
                                                                 from upsert);
  end loop;
*/
  select coalesce (hstore (array_agg(cfi.Id_CashFlow_Item::text order by cfi.Id_CashFlow_Item), 
                           array_agg(upper(cf$_cashflow_item.full_name(cfi.id_cashflow_item, '@#$')) order by cfi.Id_CashFlow_Item)), ''::hstore)
    into vCashFlow_Item
    from cf$.v_CashFlow_Item cfi;

--  select '"items": [' || string_agg ('{' || '"fn":' || json.to_json(full_name) || ',' || '"idCashFlowItem":' || a.Id_CashFlow_Item::text || ',"parent":' || parent || ',' || s || '}' , ',' order by vCashFlow_Item->Id_CashFlow_Item::text) || ']'
  with b as (select d.Id_CashFlow_Item, 
                    d.Parent, 
                    d.Month, 
                    string_agg ( '"' || d.Id_Currency || '":' ||  d.summa::text, ',') as s
               from cf$_report.dynamics1 d
              group by d.Id_CashFlow_Item, d.Parent, d.Month
             ),
       a as (select Id_CashFlow_Item::text, 
                    Parent, 
                    vCashFlow_Item->Id_CashFlow_Item::text as Full_Name,
                    string_agg('"' || Month::text || '":{' || s || '}', ',' order by Month) as s
               from b
               group by Id_CashFlow_Item, Parent
               )
  select '"items": [' || string_agg ('{' || '"idCashFlowItem":' || coalesce(a.Id_CashFlow_Item::text, 'null') || ',"parent":' || parent || ',' || s || '}' , ',' order by Full_Name) || ']'
    into oResult
    from a;
    

    
end;
$function$
