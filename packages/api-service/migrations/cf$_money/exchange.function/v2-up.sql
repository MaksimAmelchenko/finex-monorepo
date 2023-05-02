create or replace function "cf$_money".exchange(p_project_id integer,
                                                p_amount numeric,
                                                p_from_money_id integer,
                                                p_to_money_id integer,
                                                p_rate_date date,
                                                p_currency_rate_source_id integer,
                                                p_is_round boolean default true)
  returns numeric
  language plpgsql
  stable security definer
as
$function$
declare
  v_to_currency_code   cf$.currency.code%type;
  v_from_currency_code cf$.currency.code%type;
  v_precision          cf$.money.precision%type;
  v_result             numeric;
begin
  if p_from_money_id = p_to_money_id then
    return p_amount;
  end if;

  select c.code
    into v_from_currency_code
    from cf$.money m,
         cf$.currency c
   where m.id_project = p_project_id
     and m.id_money = p_from_money_id
     and c.code = m.currency_code;

  select c.code,
         m.precision
    into v_to_currency_code,
      v_precision
    from cf$.money m,
         cf$.currency c
   where m.id_project = p_project_id
     and m.id_money = p_to_money_id
     and c.code = m.currency_code;


  if v_from_currency_code is null or v_to_currency_code is null then
    --    perform error$.raise ('internal_server_error', iMessage := 'Пока еще не реализован обмен валюты без указанной базовой валюты');
    return 0;
  end if;

  v_result := cf$_currency.exchange(p_amount => p_amount,
                                    p_from_currency_code => v_from_currency_code,
                                    p_to_currency_code => v_to_currency_code,
                                    p_rate_date => p_rate_date,
                                    p_currency_rate_source_id => p_currency_rate_source_id,
                                    p_is_round => false);

  if p_is_round then
    v_result := round(v_result, v_precision);
  end if;

  return v_result;
end;
$function$
