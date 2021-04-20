CREATE OR REPLACE FUNCTION "cf$_ie_item".get(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  r          record;

  vId_IE_Detail cf$.v_CashFlow_Detail.Id_CashFlow_Detail%type;

  vResult    text;

  vLimit     integer;
  vOffset    integer;
  
  vLimit_Default  int := 50;
  vOffset_Default int := 0;

  vSearchText    text;

  vDBegin        date;
  vDEnd          date;
  vSign          int;
  vContractors   int[];
  vAccounts      int[];
  vCategories    int[];
  vTags          int[];
  
  vRN    int;
  vTotal int;
  vTotal_Planned int;
  vId_Project    int := context.get('Id_Project')::int;
begin
  begin
    vId_IE_Detail := iParams->>'idIEDetail';
    vLimit := coalesce((iParams->>'limit')::int, vLimit_Default);
    vOffset := coalesce((iParams->>'offset')::int, vOffset_Default);
  exception
    when others
    then
      perform error$.raise ('invalid_parameters');
  end;

  if (iParams \? 'dBegin') then
    begin
      vDBegin := sanitize$.to_date (iParams->>'dBegin');
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"dBegin" must be a date');
    end;
  end if;

  if (iParams \? 'dEnd') then
    begin
      vDEnd := sanitize$.to_date (iParams->>'dEnd');
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"dEnd" must be a date');
    end;
  end if;

  if (iParams \? 'sign') then
    begin
      vSign :=  sanitize$.to_String(iParams->>'sign');
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"sign" must be a 1, -1 or null');
    end;
  end if;
  
  vSearchText := sanitize$.to_String (iParams->>'searchText');
  
  if (iParams \? 'contractors') 
  then
    begin
      vContractors := string_to_array (nullif (trim (iParams->>'contractors'), ''), ',')::int[];
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"contractors" must be a list of integer');
    end;
  end if;

  if (iParams \? 'accounts') 
  then
    begin
      vAccounts := string_to_array (nullif (trim (iParams->>'accounts'), ''), ',')::int[];
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"accounts" must be a list of integer');
    end;
  end if;

  if (iParams \? 'categories') 
  then
    begin
      vCategories := string_to_array (nullif (trim (iParams->>'categories'), ''), ',')::int[];
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"categories" must be a list of integer');
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
  for r in (with recursive 
              ct (Id_Category) as (select c.Id_Category
                                     from cf$.v_Category c  
                                    where c.Id_Category in (select unnest (vCategories))
                                    union all
                                   select c.Id_Category
                                     from ct, cf$.v_Category c
                                    where c.Parent = ct.Id_Category
                                  ),
/*                c_s as (select c.Id_Contractor
                          from cf$.v_Contractor c
                          where upper(c.name) like upper('%' || vSearchText || '%')
                            and vSearchText is not null),
*/                            
                -- Пришлось использовать "лишнюю" таблицу CashFlow, но если проверять на Id_Contractor, то слишком долго выполняется
              cf_s as (select cf.Id_CashFlow
                         from cf$.v_Contractor c
                              join cf$.CashFlow cf 
                                on (    cf.Id_Project = c.Id_Project 
                                    and cf.Id_Contractor = c.Id_Contractor)
                        where vSearchText is not null
                          and upper(c.name) like upper('%' || vSearchText || '%')
                          and cf.Id_CashFlow_Type = 1
                      ),
              t_s as (select array (select t.Id_tag
                                      from cf$.v_Tag t
                                     where vSearchText is not null
                                       and upper(t.name) like upper('%' || vSearchText || '%')
                                   ) as tags
                     ),
              ct_s as (select c.Id_Category
                         from cf$.v_Category c  
                        where vSearchText is not null
                          and upper(c.name) like upper('%' || vSearchText || '%')
                        union all
                       select c.Id_Category
                         from ct_s, cf$.v_Category c
                        where c.Parent = ct_s.Id_Category
                        ),
              cfi as (select cfd.Id_User,
                             cfd.Id_CashFlow_Detail,
                             cfd.Id_CashFlow,
                             cf.Id_Contractor,
                             cfd.Id_Account,
                             cfd.Id_Category,
                             cfd.Id_Money,
                             cfd.Id_Unit,
                             cfd.Sign,
                             cfd.DCashFlow_Detail,
                             cfd.Report_Period,
                             cfd.Quantity,
                             cfd.Sum,
                             cfd.Note,
                             cfd.Is_Not_Confirmed,
                             cfd.Tags,
                             cfd.Permit,
                             null::int as Id_Plan,
                             null::int as NRepeat,
                             null::text as Color_Mark
                        from      cf$.v_CashFlow_Detail cfd 
                             join cf$.CashFlow cf on (    cf.Id_Project = cfd.Id_Project 
                                                      and cf.Id_CashFlow = cfd.Id_CashFlow)
                       where cfd.Id_Project = vId_Project
                         and cfd.Id_CashFlow_Detail = coalesce(vId_IE_Detail, cfd.Id_CashFlow_Detail)
                         and cf.Id_CashFlow_Type = 1

/*                        from      cf$.CashFlow cf
                               join cf$.v_CashFlow_Detail cfd  
                                 on (    cfd.Id_Project = cf.Id_Project 
                                     and cfd.Id_CashFlow = cf.Id_CashFlow)
                       where cf.Id_Project = vId_Project
                         and cf.Id_CashFlow_Type = 1
                         and cfd.Id_CashFlow_Detail = coalesce(vId_IE_Detail, cfd.Id_CashFlow_Detail)
*/
                       union all 
                      select pcfi.Id_User,
                             null,
                             null,
                             pcfi.Id_Contractor,
                             pcfi.Id_Account,
                             pcfi.Id_Category,
                             pcfi.Id_Money,
                             pcfi.Id_Unit,
                             pcfi.Sign,
                             s.DPlan,
                             s.Report_Period,
                             pcfi.Quantity,
                             pcfi.Sum,
                             pcfi.Operation_Note as Note,
                             false as Is_Not_Confirmed,
                             pcfi.OPeration_Tags as Tags,
                             pcfi.Permit,
                             pcfi.Id_Plan, 
                             s.NRepeat,
                             pcfi.Color_Mark
                        from cf$.v_Plan_CashFlow_Item pcfi,
                             cf$_plan.schedule(pcfi.Id_Plan, pcfi.DBegin, (now() + interval '1 day')::date ) s
                       where vId_IE_Detail is null
                     )
            select cfi.Id_User,
                   cfi.Id_CashFlow_Detail,
                   cfi.Id_CashFlow,
                   cfi.Id_Contractor,
                   cfi.Id_Account,
                   cfi.Id_Category,
                   cfi.Id_Money,
                   cfi.Id_Unit,
                   cfi.Sign,
                   cfi.DCashFlow_Detail,
                   cfi.Report_Period,
                   cfi.Quantity,
                   cfi.Sum,
                   cfi.Note,
                   cfi.Is_Not_Confirmed,
                   cfi.Tags,
                   cfi.Permit,
                   cfi.Id_Plan,
                   cfi.NRepeat,
                   cfi.Color_Mark,
                   count(*) over() as Total,
                   count(*) filter (where cfi.Id_Plan is not null) over() as Total_Planned
              from cfi
             where (vDBegin is null or cfi.DCashFlow_Detail >= vDBegin)
               and (vDEnd is null or cfi.DCashFlow_Detail <= vDEnd)
               and (vSign is null or cfi.Sign = vSign)
               and (vContractors is null or cfi.Id_Contractor in (select unnest (vContractors)))
               and (vAccounts is null or cfi.Id_Account in (select unnest (vAccounts)))
               and (vCategories is null or cfi.Id_Category in (select Id_Category from ct))
               and (vTags is null or cfi.tags && vTags)
               and (   vSearchText is null 
                    or upper(cfi.Note) like upper('%' || vSearchText || '%')
/*                    or cf.Id_Contractor in (select Id_Contractor from c_s)*/
                    or cfi.Id_CashFlow in (select id_CashFlow from cf_s)
                    or cfi.Tags && (select tags from t_s)
                    or cfi.Id_Category in (select Id_Category from ct_s)
                   )
             order by case when cfi.Id_Plan is null then 1 else 0 end,
                      cfi.DCashFlow_Detail desc, 
                      cfi.Id_CashFlow desc, 
                      cfi.Id_Cashflow_Detail desc, 
                      cfi.Id_Plan)
	     -- Нужно ВСЕГДА получать правильное количество записей, если даже их нет в заданном диапозоне offset и limit
	     -- limit vLimit offset vOffset
  loop
    vTotal := r.Total;
    vTotal_Planned := r.Total_Planned;
    vRN := vRN + 1;
    exit when vRN > vOffset + vLimit or vOffset >= vTotal;
    continue when vRN <= vOffset;

    vResult := concat_ws (',', vResult,
                          json_build_object ('idUser', r.Id_User,
                                             'idIEDetail', r.Id_CashFlow_Detail,
                                             'idIE', r.Id_CashFlow,
                                             'idContractor',  r.Id_Contractor,
                                             'sign', r.Sign,
                                             'dIEDetail', r.DCashFlow_Detail,
                                             'reportPeriod', r.Report_Period,
                                             'idAccount', r.Id_Account,
                                             'idCategory', r.Id_Category,
                                             'quantity', r.Quantity,
                                             'idUnit', r.Id_Unit,
                                             'sum', r.Sum,
                                             'idMoney', r.Id_Money,
                                             'isNotConfirmed', r.Is_Not_Confirmed,
                                             'note', coalesce(r.Note, ''),
                                             'tags', cf$_tag.encode(r.Tags),
                                             'permit', r.Permit,
                                             'idPlan', r.Id_Plan,
                                             'nRepeat', r.NRepeat,
                                             'colorMark', coalesce(r.Color_Mark, '')
                                            ));
  end loop;

  if vId_IE_Detail is null 
  then
    oResult := json.list ( array ['ieDetails', concat ('[', vResult , ']'), 
                                  'metadata', json_build_object ('total', vTotal,
                                                                 'totalPlanned', vTotal_Planned,
                                                                 'limit', vLimit,
                                                                 'offset', vOffset
                                                                 )::text
                                  ]);
  else
    oResult := concat('"ieDetail"', ':', coalesce(vResult, '{}'));
  end if;
/*  perform pg_sleep(3);*/

end;
$function$
