create or replace function "cf$_currency".get_rate(p_currency_code text, p_rate_date date,
                                                   p_currency_rate_source_id smallint)
  returns numeric
  language plpgsql
  stable security definer cost 1000
as
$function$
declare
  v_rate cf$.currency_rate.rate%type;
begin
  select cr.rate
    into v_rate
    from cf$.currency_rate cr
   where cr.currency_rate_source_id = p_currency_rate_source_id
     and cr.currency_code = p_currency_code
     and cr.rate_date <= p_rate_date
   order by cr.rate_date desc
   limit 1;

  return coalesce(v_rate, 1);
end;
$function$
