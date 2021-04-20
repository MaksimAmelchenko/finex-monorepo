CREATE OR REPLACE FUNCTION "cf$_ie".destroy(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vCashFlow    cf$.v_CashFlow%rowtype;
  vCount       int;
  r            record;
begin
  begin
    vCashFlow.Id_CashFlow := iParams->>'idIE';
  exception
    when others then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idIE" must be a number');
  end;

  if vCashFlow.Id_CashFlow is null 
  then
	  perform error$.raise ('invalid_parameters', iDev_Message := '"idIE" is required');
  end if;

  begin
   select cf.*
     into strict vCashFlow
     from cf$.v_CashFlow cf
    where cf.Id_CashFlow = vCashFlow.Id_CashFlow
      and cf.Id_CashFlow_Type = 1;
  exception
    when no_data_found 
    then
      perform error$.raise ('no_data_found');
  end;

  -- Удаляем все доступные детализации потока
  -- TODO Удаление одним запросом 
  for r in (select Id_Project,
                   Id_CashFlow_Detail 
              from cf$.v_CashFlow_Detail cfd
             where cfd.Id_CashFlow = vCashFlow.Id_CashFlow)
  loop
    delete 
      from cf$.CashFlow_Detail cfd
     where cfd.Id_Project = r.Id_Project
       and cfd.Id_CashFlow_Detail = r.Id_CashFlow_Detail;
  end loop;
              
   
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
