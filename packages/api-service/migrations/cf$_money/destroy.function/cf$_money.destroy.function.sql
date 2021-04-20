CREATE OR REPLACE FUNCTION "cf$_money".destroy(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vMoney cf$.v_Money%rowtype;
begin

  if iParams \? 'idMoney' then
    begin
      vMoney.Id_Money := (iParams->>'idMoney')::int;
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idMoney" must be a number');
    end;
  end if;
  
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

  begin
    delete 
      from cf$.Money m
     where m.Id_Project = vMoney.Id_Project
       and m.Id_Money = vMoney.Id_Money;
  exception
    when foreign_key_violation then
      declare
        vConstraint_Name text;
      begin    
        get stacked diagnostics vConstraint_Name = CONSTRAINT_NAME;
        perform error$.raise ('foreign_key_violation.' || vConstraint_Name, idb_message := SQLERRM);
      end;
  end;
end;
$function$
