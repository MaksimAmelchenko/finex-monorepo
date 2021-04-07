CREATE OR REPLACE FUNCTION "cf$_debt".balance(idbalance date, iid_money integer DEFAULT NULL::integer)
 RETURNS TABLE(id_contractor integer, id_money integer, sum numeric)
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
  with 
    ctx as (select context.get('Id_Project'::text)::integer AS id_project,
                   cf$_category.get_category_by_prototype(2) as Id_Debt_2,
                   cf$_category.get_category_by_prototype(3) as Id_Debt_3
           ),
    d as (select cf.Id_Contractor,
                 cfd.Id_Money,
                 sum(cfd.Sign * cfd.sum) as Sum
            from      ctx 
                 join cf$.CashFlow cf using (Id_Project)
                 join cf$.v_CashFlow_Detail cfd using (Id_Project, Id_CashFlow)
           where cf.Id_CashFlow_Type = 2
             and cfd.DCashFlow_Detail <= iDBalance
             and cfd.Id_Category in (ctx.Id_Debt_2, ctx.Id_Debt_3)
           group by cf.Id_CashFlow,
                    cf.Id_Contractor,
                    cfd.Id_Money
          having sum(cfd.Sign * cfd.sum) != 0
         ),
    o as (select Id_Contractor,
                 Id_Money,
                 sum (d.Sum) as Sum
            from d
           group by d.Id_Contractor,
                    d.Id_Money,
                    sign(d.sum)
         )
  select o.Id_Contractor,
         o.Id_Money,
         o.Sum
    from o
   where iId_Money is null
   union all  
  select o.Id_Contractor,
         iId_Money as Id_Money,
         sum(cf$_money.exchange(o.Sum, o.Id_Money, iId_Money, iDBalance)) as Sum
    from o
   where iId_Money is not null
   group by o.Id_Contractor,
            iId_Money;
$function$
