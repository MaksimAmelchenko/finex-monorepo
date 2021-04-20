CREATE OR REPLACE FUNCTION "cf$_account".account_balance_w_p(idend date)
 RETURNS TABLE(id_money integer, id_account integer, dbalance date, sum_in numeric, sum_out numeric)
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
with 
  a as (select a.Id_Project,
               a.Id_Account
          from cf$.v_Account a
       ),
  o as (select ab.Id_Money,
               ab.Id_Account,
               ab.DBalance,
               ab.Sum_In,
               ab.Sum_Out
          from a
               join cf$.Account_Balance ab using (Id_Project, Id_Account)
         where ab.DBalance <= iDEnd 
         union all   
        -- Доходы и расходы
        select pcfi.Id_Money,
               pcfi.Id_Account,
               s.DPlan as DBalance,
               case when pcfi.Sign = 1 then pcfi.Sum else 0 end as Sum_In,
               case when pcfi.Sign = -1 then pcfi.Sum else 0 end as Sum_Out
          from a
               join cf$.v_Plan_CashFlow_Item pcfi using (Id_Project, Id_Account)
               join cf$_plan.schedule(pcfi.Id_Plan, pcfi.DBegin, iDEnd) s on (1=1)
         union all   
        -- Перевод
        select pt.Id_Money,
               pt.Id_Account_From as Id_Account,
               s.DPlan as DBalance,
               0 as Sum_In,
               pt.Sum as Sum_Out
          from a
               join cf$.v_Plan_Transfer pt 
                 on (    pt.Id_Project = a.Id_Project 
                     and pt.Id_Account_From = a.Id_Account)
               join cf$_plan.schedule(pt.Id_Plan, pt.DBegin, iDEnd) s on (1=1)
         union all   
        select pt.Id_Money_Fee as Id_Money,
               pt.Id_Account_Fee as Id_Account,
               s.DPlan as DBalance,
               0 as Sum_In,
               pt.Fee as Sum_Out
          from a
               join cf$.v_Plan_Transfer pt 
                 on (    pt.Id_Project = a.Id_Project 
                     and pt.Id_Account_From = a.Id_Account)
               join cf$_plan.schedule(pt.Id_Plan, pt.DBegin, iDEnd) s on (1=1)
         union all   
        select pt.Id_Money,
               pt.Id_Account_To as Id_Account,
               s.DPlan as DBalance,
               pt.Sum as Sum_In,
               0 as Sum_Out
          from a
               join cf$.v_Plan_Transfer pt 
                 on (     pt.Id_Project = a.Id_Project 
                     and  pt.Id_Account_To = a.Id_Account)
               join cf$_plan.schedule(pt.Id_Plan, pt.DBegin, iDEnd) s on (1=1)
         union all
        -- Обмен валюты   
        select pe.Id_Money_From as Id_Money,
               pe.Id_Account_From as Id_Account,
               s.DPlan as DBalance,
               0 as Sum_In,
               pe.Sum_From as Sum_Out
          from a
               join cf$.v_Plan_Exchange pe 
                 on (    pe.Id_Project = a.Id_Project 
                     and pe.Id_Account_From = a.Id_Account)
               join cf$_plan.schedule(pe.Id_Plan, pe.DBegin, iDEnd) s on (1=1)
         union all   
        select pe.Id_Money_To as Id_Money,
               pe.Id_Account_To as Id_Account,
               s.DPlan as DBalance,
               pe.Sum_To as Sum_In,
               0 as Sum_Out
          from a
               join cf$.v_Plan_Exchange pe 
                 on (    pe.Id_Project = a.Id_Project 
                     and pe.Id_Account_To = a.Id_Account)
               join cf$_plan.schedule(pe.Id_Plan, pe.DBegin, iDEnd) s on (1=1)
         union all   
        select pe.Id_Money_Fee as Id_Money,
               pe.Id_Account_Fee as Id_Account,
               s.DPlan as DBalance,
               0 as Sum_In,
               pe.Fee as Sum_Out
          from a
               join cf$.v_Plan_Exchange pe 
                 on (    pe.Id_Project = a.Id_Project 
                     and pe.Id_Account_To = a.Id_Account)
               join cf$_plan.schedule(pe.Id_Plan, pe.DBegin, iDEnd) s on (1=1)
       )
select Id_Money,
       Id_Account,
       DBalance,
       sum (Sum_In) as Sum_In,
       sum (Sum_Out) as Sum_Out
   from o
  group by Id_Money,
           Id_Account,
           DBalance
$function$
