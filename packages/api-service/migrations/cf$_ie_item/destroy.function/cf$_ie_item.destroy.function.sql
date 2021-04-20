CREATE OR REPLACE FUNCTION "cf$_ie_item".destroy(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vCashFlow_Detail    cf$.v_CashFlow_Detail%rowtype;
  vCount       int;
  r            record;
begin

  begin
    vCashFlow_Detail.Id_CashFlow_Detail := iParams->>'idIEDetail';
  exception
    when others then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idIEDetail" must be a number');
  end;
  
  if vCashFlow_Detail.Id_CashFlow_Detail is null 
  then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idIEDetail" is required');
  end if;

  begin
    select cfd.*
      into strict vCashFlow_Detail
      from cf$.v_CashFlow_Detail cfd
           join cf$.CashFlow cf using (Id_Project, Id_CashFlow)
     where cfd.Id_CashFlow_Detail = vCashFlow_Detail.Id_CashFlow_Detail
       and cf.Id_CashFlow_Type = 1;
  exception
    when no_data_found 
    then
      perform error$.raise ('no_data_found');
  end;

  delete 
    from cf$.CashFlow_Detail cfd
   where cfd.Id_Project = vCashFlow_Detail.Id_Project
     and cfd.Id_CashFlow_Detail = vCashFlow_Detail.Id_CashFlow_Detail;
              
  select count(*)
    into vCount
    from cf$.CashFlow_Detail cfd
   where cfd.Id_Project = vCashFlow_Detail.Id_Project
     and cfd.Id_CashFlow = vCashFlow_Detail.Id_CashFlow;

  -- Если поток не содержит больше детализаций
  if vCount = 0 
  then
    -- Если для потока не задан контрагент и примечание, то удаляем его
    
--    select count(*)
--      into vCount
--      from cf$.CashFlow cf
--     where cf.Id_Project = vCashFlow_Detail.Id_Project
--       and cf.Id_CashFlow = vCashFlow_Detail.Id_CashFlow
--       and cf.Id_Contractor is null
--       and cf.Note is null;
--
--    if vCount = 1 
--    then
    delete 
      from cf$.CashFlow cf
     where cf.Id_Project = vCashFlow_Detail.Id_Project
       and cf.Id_CashFlow = vCashFlow_Detail.Id_CashFlow;
--    end if;
  end if;
end;
$function$
