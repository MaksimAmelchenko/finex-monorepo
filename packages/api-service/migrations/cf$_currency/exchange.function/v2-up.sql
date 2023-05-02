create or replace function "cf$_currency".exchange(p_amount numeric, p_from_currency_code text, p_to_currency_code text,
                                                   p_rate_date date, p_currency_rate_source_id integer default 1,
                                                   p_is_round bool default true)
  returns numeric
  language plpgsql
  stable security definer
as
$function$
declare
  v_result             numeric;
  v_rate               numeric;
  v_base_currency_code text;
begin
  if p_from_currency_code = p_to_currency_code then
    return p_amount;
  end if;

  if p_currency_rate_source_id = 1 then
    -- https://openexchangerates.org/
    v_base_currency_code := 'USD';
  elsif p_currency_rate_source_id = 2 then
    -- https://www.cbr.ru/
    v_base_currency_code := 'RUB';
  else
    perform error$.raise('internal_server_error');
  end if;

  if p_from_currency_code = v_base_currency_code then
    v_result := p_amount * cf$_currency.get_rate(p_to_currency_code, p_rate_date, p_currency_rate_source_id);
  elsif p_to_currency_code = v_base_currency_code then
    v_rate = cf$_currency.get_rate(p_from_currency_code, p_rate_date, p_currency_rate_source_id);
    if v_rate = 0 then
      v_result := 0;
    else
      v_result := p_amount / v_rate;
    end if;
  else
    -- Exchange through Base Currency
    v_result := cf$_currency.exchange(
        cf$_currency.exchange(p_amount, p_from_currency_code, v_base_currency_code, p_rate_date,
                              p_currency_rate_source_id, false),
        v_base_currency_code, p_to_currency_code, p_rate_date, p_currency_rate_source_id, false);
  end if;

  if p_is_round then
    declare
      v_precision cf$.currency.precision%type;
    begin
      select c.precision
        into v_precision
        from cf$.currency c
       where c.code = p_to_currency_code;

      v_result := round(v_result, coalesce(v_precision, 2));
    end;
  end if;

  return v_result;
end ;
$function$
