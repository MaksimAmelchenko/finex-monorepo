CREATE OR REPLACE FUNCTION "cf$_currency".get_rate_old(iid_currency integer, idrate date)
 RETURNS numeric
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER COST 1000
AS $function$
declare
  vRate cf$.Currency_Rate.Rate%type;
begin
/*
  with o as (select row_number() over (order by cr.DRate desc) as rn, 
                    cr.Rate
               from cf$.Currency_Rate cr
              where cr.Id_Currency = iId_Currency
                and cr.DRate <= iDRate)
  select o.Rate
    into vRate
    from o
   where rn = 1;
*/
  select cr.Rate
    into vRate
    from cf$.Currency_Rate_Old cr
   where cr.Id_Currency = iId_Currency
     and cr.DRate <= iDRate
   order by cr.DRate desc
   limit 1;
   
   return coalesce(vRate, 1);
end;
$function$
