CREATE OR REPLACE FUNCTION "cf$_money".update(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vMoney  cf$.v_Money%rowtype;
begin
  begin
    vMoney.Id_Money := (iParams->>'idMoney')::int;
  exception
    when others then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idMoney" must be a number');
  end;

  if vMoney.Id_Money is null then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idMoney" is required');
  end if;
 
  begin
    select m.*
      into strict vMoney
      from cf$.v_Money m
     where m.Id_Money = vMoney.Id_Money;
  exception
    when no_data_found then
      perform error$.raise ('no_data_found');
  end;

  if (iParams \? 'name') then
    vMoney.Name := sanitize$.to_String (iParams->>'name');
    if vMoney.Name is null then
      perform error$.raise ('invalid_parameters', iDev_Message := '"name" is empty');
    end if;
  end if;
  
  if (iParams \? 'symbol') then
    vMoney.Symbol := sanitize$.to_String (iParams->>'symbol');
    if vMoney.Symbol is null then
      perform error$.raise ('invalid_parameters', iDev_Message := '"symbol" is empty');
    end if;
  end if;

  if (iParams \? 'idCurrency') then
    vMoney.Id_Currency := (iParams->>'idCurrency')::int;
  end if;

  if (iParams \? 'isEnabled') then
    begin
      vMoney.Is_Enabled := (iParams->>'isEnabled')::boolean;
      if vMoney.Is_Enabled is null then
        perform error$.raise ('invalid_parameters', iDev_Message := '"isEnabled" is required');
      end if;
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"isEnabled" must be true or false');
    end;
  end if;

  if (iParams \? 'precision') 
  then
    vMoney.precision := (iParams->>'precision')::int;
  end if;

  begin
    update cf$.Money m
       set Id_Currency = vMoney.Id_Currency,
           name = vMoney.name,
           Symbol = vMoney.Symbol,
           Is_Enabled = vMoney.Is_Enabled,
           precision = vMoney.precision
     where m.Id_Project = vMoney.Id_Project
       and m.Id_Money = vMoney.Id_Money;
  exception
    when unique_violation then
      declare
        vConstraint_Name text;
      begin    
        get stacked diagnostics vConstraint_Name = CONSTRAINT_NAME;
        perform error$.raise ('unique_violation.' || vConstraint_Name, idb_message := SQLERRM);
      end;
    when check_violation then
      declare
        vConstraint_Name text;
      begin    
        get stacked diagnostics vConstraint_Name = CONSTRAINT_NAME;
        perform error$.raise ('check_violation.' || vConstraint_Name, idb_message := SQLERRM);
      end;
  end;

  oResult := cf$_Money.get (('{"idMoney": ' || vMoney.Id_Money::text || '}')::jsonb);
end;
$function$
