CREATE OR REPLACE FUNCTION "cf$_debt".destroy(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vCashFlow  cf$.v_CashFlow%rowtype;
  vCount     int;
begin
  begin
    vCashFlow.Id_CashFlow := iParams->>'idDebt';
  exception
    when others then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idDebt" must be a number');
  end;

  if vCashFlow.Id_CashFlow is null 
  then
	  perform error$.raise ('invalid_parameters', iDev_Message := '"idDebt" is required');
  end if;
 
 begin
   select cf.*
     into strict vCashFlow
     from cf$.v_CashFlow cf
    where cf.Id_CashFlow = vCashFlow.Id_CashFlow
      and cf.Id_CashFlow_Type = 2;
  exception
    when no_data_found 
    then
      perform error$.raise ('no_data_found');
  end;

  -- Удаляем все доступные детализации потока
  with 
    d as (select cfd.Id_Project,
                 cfd.Id_CashFlow_Detail 
            from cf$.v_CashFlow_Detail cfd
           where cfd.Id_Project = vCashFlow.Id_Project
             and cfd.Id_CashFlow = vCashFlow.Id_CashFlow)
  delete 
    from cf$.CashFlow_Detail cfd
   using d
   where cfd.Id_Project = d.Id_Project
     and cfd.Id_CashFlow_Detail = d.Id_CashFlow_Detail;
              
   
  select count(*)
    into vCount
    from cf$.CashFlow_Detail cfd    
   where cfd.Id_Project = vCashFlow.Id_Project
     and cfd.Id_CashFlow = vCashFlow.Id_CashFlow;

  -- Если поток не содержит больше детализаций, то удаляем и его
  if vCount = 0 
  then
    delete 
      from cf$.CashFlow cf
     where cf.Id_Project = vCashFlow.Id_Project
       and cf.Id_CashFlow = vCashFlow.Id_CashFlow;
  end if;
end;
$function$
