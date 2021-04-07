CREATE OR REPLACE FUNCTION "cf$_money"."create"(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vMoney cf$.v_Money%rowtype;
begin
  
  begin
    vMoney.Id_Currency := (iParams->>'idCurrency')::int;
  exception
    when others then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idCurrency" must be a number');
  end;
  
  vMoney.Name := sanitize$.to_String (iParams->>'name');
    
  if vMoney.Name is null then
    perform error$.raise ('invalid_parameters', iDev_Message := '"name" is required');
  end if;

  vMoney.Symbol := sanitize$.to_String (iParams->>'symbol');
    
  if vMoney.Symbol is null then
    perform error$.raise ('invalid_parameters', iDev_Message := '"symbol" is required');
  end if;

  begin
    vMoney.Is_Enabled := (iParams->>'isEnabled')::boolean;
  exception
    when others then
      perform error$.raise ('invalid_parameters', iDev_Message := '"isEnabled" must be true or false');
  end;

  if vMoney.Is_Enabled is null then
    perform error$.raise ('invalid_parameters', iDev_Message := '"isEnabled" is required');
  end if;

  begin
    vMoney.precision := (iParams->>'precision')::int;
  exception
    when others 
    then
      vMoney.precision := 2;
  end;

  begin
    insert into cf$.Money
                (Id_Currency, name, Symbol, Is_Enabled, precision)
         values (vMoney.Id_Currency, vMoney.Name, vMoney.Symbol, vMoney.Is_Enabled, vMoney.precision)
      returning Id_Money
           into vMoney.Id_Money;
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
