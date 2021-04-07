CREATE OR REPLACE FUNCTION "cf$_account".balance(idbalance date, iid_money integer DEFAULT NULL::integer)
 RETURNS TABLE(id_account integer, id_money integer, sum numeric)
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
/*  with o as (select sum(a.sum_in - a.sum_out) over (ORDER BY a.dsaldo) AS saldo,
                    dsaldo
               from cf$.account_saldo a
              where a.Id_Account = iId_Account
                and a.Id_Money = iId_Money
                and a.DSaldo <= iDSaldo)
  select coalesce (substring (max (to_char (o.DSaldo, 'yyyymmdd') || o.Saldo::text) from 9)::numeric, 0)
    into vResult
    from o;
*/
  with a as (select row_number() over (partition by ab.Id_Account, ab.Id_Money order by ab.DBalance desc) as rn, 
                    ab.Id_Account,
                    ab.Id_Money,
                    sum(ab.sum_in - ab.sum_out) over (partition by ab.Id_Account, ab.Id_Money order by ab.DBalance) as Sum
               from      cf$.v_Account a 
                    join cf$.Account_Balance ab using (Id_Project, Id_Account)
              where ab.DBalance <= iDBalance),
       o  as (select a.Id_Account,
                     a.Id_Money,
                     a.Sum
                from a
                where rn = 1)
  select o.Id_Account,
         o.Id_Money,
         o.Sum
    from o
   where iId_Money is null
   union all  
  select o.Id_Account,
         iId_Money as Id_Money,
         sum(cf$_money.exchange(o.Sum, o.Id_Money, iId_Money, iDBalance)) as Sum
    from o
   where iId_Money is not null
   group by o.Id_Account,
            iId_Money;
$function$
