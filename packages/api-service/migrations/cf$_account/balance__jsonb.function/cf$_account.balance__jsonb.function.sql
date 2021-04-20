CREATE OR REPLACE FUNCTION "cf$_account".balance(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vResult   text;
  vDBalance date;
  vId_Money cf$.Money.Id_Money%type;
begin
  begin
    vDBalance := sanitize$.to_date(iParams->>'dBalance');
  exception
    when others then
      perform error$.raise ('invalid_parameters', iDev_Message := '"dBalance" must be a date');
  end;

  if vDBalance is null then
    perform error$.raise ('invalid_parameters', iDev_Message := '"dBalance" is required');
  end if;

  if (iParams \? 'idMoney') then
    begin
      vId_Money := nullif (iParams->>'idMoney', '')::int;
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idMoney" must be a int');
    end;
  end if;

  with a as (select s.Id_Account, 
                    string_agg('{"idMoney":' || s.Id_Money::text || ',"sum":' || json.to_json(s.Sum) || '}', ',') as s
               from cf$.v_Account a 
                    join cf$_account.balance (vDBalance, vId_Money) s using (Id_Account)
--              where a.Is_Enabled = true 
              group by s.Id_Account)
  select  string_agg ('{"idAccount":' || a.Id_Account::text
                       || ',"balances":[' || s || ']}',
                      ',')
    into vResult
    from a;

  oResult := concat('"accountBalances"', ':', '[', vResult, ']');
end;
$function$
