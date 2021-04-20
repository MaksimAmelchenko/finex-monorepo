CREATE OR REPLACE FUNCTION "cf$_ie".get(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  r          record;
  vId_IE     int;
  vResult    text;
  vIEDetails json;

  vLimit     integer;
  vOffset    integer;
  
  vLimit_Default  int := 50;
  vOffset_Default int := 0;

  vSearchText    text;

  vDBegin        date;
  vDEnd          date;
  vContractors   int[];
  vAccounts      int[];
  vTags          int[];

  vTotal int;
begin
  begin
    vId_IE := iParams->>'idIE';
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
  
  vSearchText := sanitize$.to_String(iParams->>'searchText');
  
  if (iParams \? 'contractors') then
    begin
      vContractors := string_to_array(nullif (trim (iParams->>'contractors'), ''), ',')::int[];
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"contractors" must be a list of integer');
    end;
  end if;

  if (iParams \? 'accounts') then
    begin
      vAccounts := string_to_array (nullif ( trim(iParams->>'accounts'), ''), ',')::int[];
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"accounts" must be a list of integer');
    end;
  end if;

  if (iParams \? 'tags') then
    begin
      vTags := string_to_array(nullif(iParams->>'tags', ''), ',')::int[];
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"tags" must be a list of integer');
    end;
  end if;

  if vLimit < 0 and vLimit > 100 then
    vLimit := vLimit_Default;
  end if;
  
  if vOffset < 0 then
    vOffset := vOffset_Default;
  end if;
  
  vTotal := 0;
  for r in (with 
--              a_s as (select a.Id_Account
--                        from cf$.v_Account a
--                       where vSearchText is not null
--                         and upper(a.name) like upper('%' || vSearchText || '%')),
              cfd as (select cfdi.Id_CashFlow, 
                             max (cfdi.DCashFlow_Detail) as DLast
                        from cf$.v_CashFlow_Detail cfdi
                       where (vDBegin is null or cfdi.DCashFlow_Detail >= vDBegin)
                         and (vDEnd is null or cfdi.DCashFlow_Detail <= vDEnd)
                         and (vAccounts is null or cfdi.Id_Account in (select unnest (vAccounts)))
--                         and (   vSearchText is null 
 --                             or cfdi.Id_Account in (select Id_Account from a_s))
                       group by cfdi.Id_CashFlow),
              c_s as (select c.Id_Contractor
                        from cf$.v_Contractor c
                       where vSearchText is not null
                         and upper(c.name) like upper('%' || vSearchText || '%')),
              t_s as (select array (select t.Id_tag
                                      from cf$.v_Tag t
                                     where vSearchText is not null
                                       and upper(t.name) like upper('%' || vSearchText || '%')) as tags),
             ctx as (select context.get('Id_Project')::int as Id_Project,
                            context.get('Id_User')::int as Id_User)
            select -- Пытаемся сделать как можно меньше вычислений, т.к. они будут выполнены для ВСЕГО
                   -- набора данных, а не для конечной выборки
                   cf.Id_Project,
                   cf.Id_User,
                   cf.Id_CashFlow,
                   cf.Id_Contractor,
                   cf.Note,
                   cf.DSet,
                   cf.Tags,
                   row_number() over (order by coalesce (cfd.DLast, cf.DSet) desc, cf.Id_Cashflow desc) as rn,   
                   count(*) over () as Total
              from      ctx 
                   join cf$.CashFlow cf on (    cf.Id_Project = ctx.Id_Project
                                            and cf.Id_CashFlow_Type = 1)
                   left join cfd
                          on (cfd.Id_CashFlow = cf.Id_CashFlow) 
             where (   (    cfd.Id_CashFlow is null
                         -- Показываем свой пустой денежный поток
                         and cf.Id_User = ctx.Id_User
                         -- Если есть фильтр, то не показываем "пустые" ДП
                         and vDBegin is null
                         and vDEnd is null
                         and vAccounts is null
                        )
                    or cfd.Id_CashFlow is not null)
               and (cf.Id_CashFlow = vId_IE or vId_IE is null)
--               and cf.Id_CashFlow = coalesce(vId_IE, cf.Id_CashFlow)
               and (vContractors is null or cf.Id_Contractor in (select unnest (vContractors)))
               and (vTags is null or cf.tags && vTags)
               and (   vSearchText is null 
                    or cf.Id_Contractor in (select Id_Contractor from c_s)
                    or upper(cf.Note) like upper('%' || vSearchText || '%')
                    or cf.Tags && (select tags from t_s)
                   )
             order by coalesce (cfd.DLast, cf.DSet) desc, cf.Id_Cashflow desc) 
  loop
    -- Не использовал условие where c Rank, т.к. нужно в любом случае получить Total, даже если указали запредельное смещение
    vTotal := r.Total;
    exit when r.rn > vOffset + vLimit or vOffset >= vTotal;
    continue when r.rn <= vOffset;
    
    with cfd as (select Id_User as "idUser",
                        Id_CashFlow_Detail as "idIEDetail",
                        Sign,
                        json.format (DCashFlow_Detail) as "dIEDetail",
                        json.format (Report_Period) as "reportPeriod",
                        Id_Account as "idAccount",
                        Id_Category as "idCategory",
                        Quantity,
                        Id_Unit as "idUnit",
                        Sum,
                        Id_Money as "idMoney",
                        Is_Not_Confirmed as "isNotConfirmed",
                        coalesce(Note, '') as note,
                        cf$_tag.encode(cfd.Tags) as Tags,
                        cfd.Permit
                 from cf$.v_CashFlow_Detail cfd
                where cfd.Id_Project = r.Id_Project
                  and cfd.Id_CashFlow = r.Id_CashFlow
                  -- Показываем все ДДП. Фильтр был использован только для отбора ДП
                )
      select json_agg(cfd)
        into vIEDetails
        from cfd;

    vResult := concat_ws (',', vResult,
                          json_build_object ('idUser', r.Id_User,
                                             'idIE', r.Id_CashFlow,
                                             'idContractor', r.Id_Contractor,
                                             'note', coalesce(r.Note, ''),
                                             'tags', cf$_tag.encode(r.Tags),
                                             'ieDetails' , coalesce(vIEDetails, '[]'::json),
                                             'dSet', json.format(r.DSet)
                                            ));
  end loop;

  if vId_IE is  null then
    oResult := json.list ( array ['ies', concat ('[', vResult , ']'), 
                                  'metadata', json_build_object ('total', vTotal,
                                                                 'limit', vLimit,
                                                                 'offset', vOffset
                                                                 )::text
                                 ]);
  else
    oResult := concat ('"ie"', ':', coalesce(vResult, '{}'));
  end if;
/*  perform pg_sleep(3);*/
end;
$function$
