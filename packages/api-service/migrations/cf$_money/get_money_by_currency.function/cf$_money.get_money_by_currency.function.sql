CREATE OR REPLACE FUNCTION "cf$_money".get_money_by_currency(iid_currency integer)
 RETURNS integer
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
declare
 vId_Money cf$.Money.Id_Money%type;
begin
  begin
    select m.Id_Money
      into strict vId_Money
      from cf$.v_Money m
     where m.Id_Currency = iId_Currency;
  exception
    when others then
      vId_Money := null;
  end;
  
  return vId_Money;
end;
$function$
