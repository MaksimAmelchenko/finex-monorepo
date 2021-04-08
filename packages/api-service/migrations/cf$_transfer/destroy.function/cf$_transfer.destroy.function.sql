CREATE OR REPLACE FUNCTION "cf$_transfer".destroy(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vCashFlow    cf$.v_CashFlow%rowtype;
begin

  begin
    vCashFlow.Id_CashFlow := iParams->>'idTransfer';
  exception
    when others then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idTransfer" must be a number');
  end;

  if vCashFlow.Id_CashFlow is null then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idTransfer" is required');
  end if;

 begin
   select cf.*
     into strict vCashFlow
     from cf$.v_CashFlow cf
    where cf.Id_CashFlow = vCashFlow.Id_CashFlow
      and cf.Id_CashFlow_Type = 3;
  exception
    when no_data_found then
      perform error$.raise ('no_data_found');
  end;

  delete 
    from cf$.CashFlow_Detail cfd
   where cfd.Id_Project = vCashFlow.Id_Project
     and cfd.Id_CashFlow = vCashFlow.Id_CashFlow;
     
  delete 
    from cf$.CashFlow cf
   where cf.Id_Project = vCashFlow.Id_Project
     and cf.Id_CashFlow = vCashFlow.Id_CashFlow;
end;
$function$
