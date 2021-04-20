CREATE OR REPLACE FUNCTION "cf$_debt".get(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  r          record;
  vId_Debt     cf$.v_CashFlow.Id_CashFlow%type;

  vResult    text;
  vDebtDetails  json;

  vLimit     integer;
  vOffset    integer;
  
  vLimit_Default  int := 50;
  vOffset_Default int := 0;

  vSearchText    text;

  vDBegin        date;
  vDEnd          date;
  vIsOnlyNotPaid boolean;
  vContractors   int[];
  vTags          int[];
  vRN     int;
  vTotal  int;
begin

  begin
    vId_Debt := iParams->>'idDebt';
    vLimit := coalesce ((iParams->>'limit')::int, vLimit_Default);
    vOffset := coalesce ((iParams->>'offset')::int, vOffset_Default);
  exception
    when others
    then
      perform error$.raise ('invalid_parameters');
  end;

  vSearchText := sanitize$.to_String (iParams->>'searchText');

  if (iParams \? 'dBegin') 
  then
    begin
      vDBegin := sanitize$.to_Date (iParams->>'dBegin');
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"dBegin" must be a date');
    end;
  end if;

  if (iParams \? 'dEnd') 
  then
    begin
      vDEnd := sanitize$.to_Date (iParams->>'dEnd');
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"dEnd" must be a date');
    end;
  end if;
  
  if (iParams \? 'isOnlyNotPaid') 
  then
    begin
      vIsOnlyNotPaid := (iParams->>'isOnlyNotPaid')::boolean;
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"isOnlyNotPaid" must be a true or false');
    end;
  end if;
  
  if vIsOnlyNotPaid is null 
  then
    vIsOnlyNotPaid := false;
  end if;

  if (iParams \? 'contractors') 
  then
    begin
      vContractors := string_to_array (nullif (trim (iParams->>'contractors'), ''), ',')::int[];
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"contractors" must be a list of integer');
    end;
  end if;

  if (iParams \? 'tags') 
  then
    begin
      vtags := string_to_array (nullif (trim (iParams->>'tags'), ''), ',')::int[];
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"tags" must be a list of integer');
    end;
  end if;

  if vLimit < 0 and vLimit > 100 
  then
    vLimit := vLimit_Default;
  end if;
  
  if vOffset < 0 
  then
    vOffset := vOffset_Default;
  end if;
  
  vTotal := 0;
  vRN := 0;
  -- CFD_: Можно было просто использовать  v_CashFlow_Detail без A_, но план строится не такой красивый
  for r in (with ctx as (select context.get('Id_Project')::int as Id_Project,
                                context.get('Id_User')::int as Id_User),
--                 a_ as (select Id_Account 
--                          from cf$.v_Account),
                  cfd_ as (select cfdi.Id_CashFlow, 
                                 max (cfdi.DCashFlow_Detail) as DLast
                            from cf$.v_CashFlow_Detail cfdi
                           where (vDBegin is null or cfdi.DCashFlow_Detail >= vDBegin)
                             and (vDEnd is null or cfdi.DCashFlow_Detail <= vDEnd)
                           group by cfdi.Id_CashFlow),

--                 cfd_ as (select cfd.Id_CashFlow, 
--                                 max (cfd.DCashFlow_Detail) as DLast
--                            from      ctx
--                                 join cf$.CashFlow cf on (    cf.Id_Project = ctx.Id_Project 
--                                                          and cf.Id_CashFlow_Type = 2)
--                                 join cf$.CashFlow_Detail cfd on (    cfd.Id_Project = cf.Id_Project 
--                                                                  and cfd.Id_CashFlow = cf.Id_CashFlow)
--                                 join a_ on (a_.Id_Account = cfd.Id_Account)
--                           where (vDBegin is null or cfd.DCashFlow_Detail >= vDBegin)
--                             and (vDEnd is null or cfd.DCashFlow_Detail <= vDEnd)
--                           group by cfd.Id_CashFlow
--                          ),
        				 cfd_s as (select cfd.Id_CashFlow, 
                                  sum (cfd.sign * cfd.sum) as Sum
                             from      cf$.v_Category c
                                  join cf$.v_CashFlow_Detail cfd 
                                    on (    cfd.Id_Project = c.Id_Project
                                        and cfd.Id_Category = c.Id_Category)
                            where vIsOnlyNotPaid is true
                              and c.Id_Category_Prototype in (2,3)
                            group by cfd.Id_CashFlow),
                 c_s as (select c.Id_Contractor
                           from cf$.v_Contractor c
                          where vSearchText is not null
                            and upper(c.name) like upper('%' || vSearchText || '%')),
                 t_s as (select array (select t.Id_tag
                                         from cf$.v_Tag t
                                        where vSearchText is not null
                                          and upper(t.name) like upper('%' || vSearchText || '%')
                                      ) as tags)
            select cf.Id_Project,
                   cf.Id_User,
                   cf.Id_CashFlow,
                   cf.Id_Contractor,
                   cf.Note,
                   cf.DSet,
                   cf.Tags,
                   count(*) over () as Total
              from      ctx
                   join cf$.CashFlow cf on (    cf.Id_Project = ctx.Id_Project
                                            and cf.Id_CashFlow_Type = 2)
                   left join cfd_
                          on (cfd_.Id_CashFlow = cf.Id_CashFlow) 
             where (   (    cfd_.Id_CashFlow is null
                         and cf.Id_User = ctx.Id_User
                         and vDBegin is null
                         and vDEnd is null
                       )
                    or cfd_.Id_CashFlow is not null)
               and cf.Id_CashFlow = coalesce(vId_Debt, cf.Id_CashFlow)
               and (not vIsOnlyNotPaid or cf.Id_CashFlow in (select cfd_s.Id_CashFlow from cfd_s where cfd_s.Sum != 0))
               and (vContractors is null or cf.Id_Contractor in (select unnest (vContractors)))
               and (vTags is null or cf.tags && vTags)
               and (   vSearchText is null 
                    or cf.Id_Contractor in (select Id_Contractor from c_s)
                    or upper(cf.Note) like upper('%' || vSearchText || '%')
                    or cf.Tags && (select tags from t_s)
                   )
             order by coalesce (cfd_.DLast, cf.DSet) desc, cf.Id_Cashflow desc) 
  loop
    -- Не использовал условие where c Rank, т.к. нужно в любом случае получить Total, даже если указали запредельное смещение
--    raise notice '%', r.Id_CashFlow;
    vTotal := r.Total;
    vRN := vRN + 1;
    exit when vRN > vOffset + vLimit or vOffset >= vTotal;
    continue when vRN <= vOffset;
    
    with cfd as (select cfdi.Id_User as "idUser",
                        cfdi.Id_CashFlow_Detail as "idDebtDetail",
                        cfdi.Sign,
                        json.format (cfdi.DCashFlow_Detail) as "dDebtDetail",
                        json.format (cfdi.Report_Period) as "reportPeriod",
                        cfdi.Id_Account as "idAccount",
                        cfdi.Id_Category as "idCategory",
                        cfdi.Sum,
                        cfdi.Id_Money as "idMoney",
                        coalesce(cfdi.Note, '') as Note,
                        cf$_tag.encode(cfdi.Tags) as tags
                   from cf$.v_CashFlow_Detail cfdi
                  where cfdi.Id_CashFlow = r.Id_CashFlow)
      select json_agg(cfd)
        into vDebtDetails
        from cfd;

      vResult := concat_ws (',', vResult,
                            json_build_object ('idUser', r.Id_User,
                                               'idDebt', r.Id_CashFlow,
                                               'idContractor', r.Id_Contractor,
                                               'note', coalesce(r.Note, ''),
                                               'tags', cf$_tag.encode(r.Tags),
                                               'debtDetails' , coalesce(vDebtDetails, '[]'::json),
                                               'dSet', json.format(r.DSet)
                                              ));
  end loop;

  if vId_Debt is null 
  then
    oResult := json.list ( array ['debts', concat ('[', vResult , ']'), 
                                  'metadata', json_build_object ('total', vTotal,
                                                                 'limit', vLimit,
                                                                 'offset', vOffset
                                                                 )::text
                                 ]);
  else
    oResult := concat ('"debt"', ':', coalesce(vResult, '{}'));
  end if;
end;
$function$
