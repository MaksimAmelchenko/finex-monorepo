CREATE OR REPLACE FUNCTION "cf$_exchange".get(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  r          record;
  vId_Exchange cf$.CashFlow.Id_CashFlow%type;

  vResult    text;

  vLimit     integer;
  vOffset    integer;
  
  vLimit_Default int := 50;
  vOffset_Default int := 0;

  vSearchText    text;

  vDBegin        date;
  vDEnd          date;
  vAccountsFrom  int[];
  vAccountsTo    int[];
  vTags          int[];
  vRN    int;

  vTotal int;
  vTotal_Planned int;
begin
  begin
    vId_Exchange := iParams->>'idExchange';
    vLimit := coalesce((iParams->>'limit')::int, vLimit_Default);
    vOffset := coalesce((iParams->>'offset')::int, vOffset_Default);
  exception
    when others
    then
      perform error$.raise ('invalid_parameters');
  end;
  
  if vLimit not between 1 and 100 
  then
    vLimit := vLimit_Default;
  end if;
  
  if vOffset < 0 
  then
    vOffset := vOffset_Default;
  end if;

  vSearchText := sanitize$.to_String (iParams->>'searchText');

  if (iParams \? 'dBegin') 
  then
    begin
      vDBegin := sanitize$.to_date (iParams->>'dBegin');
    exception
      when others
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"dBegin" must be a date');
    end;
  end if;

  if (iParams \? 'dEnd') 
  then
    begin
      vDEnd := sanitize$.to_date (iParams->>'dEnd');
    exception
      when others
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"dEnd" must be a date');
    end;
  end if;
  
  
  if (iParams \? 'accountsFrom') 
  then
    begin
      vAccountsFrom := string_to_array (nullif (trim (iParams->>'accountsFrom'), ''), ',')::int[];
    exception
      when others
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"accountsFrom" must be a list of integer');
    end;
  end if;

  if (iParams \? 'accountsTo') 
  then
    begin
      vAccountsTo := string_to_array (nullif (trim (iParams->>'accountsTo'), ''), ',')::int[];
    exception
      when others
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"accountsTo" must be a list of integer');
    end;
  end if;

  if (iParams \? 'tags') 
  then
    begin
      vtags := string_to_array (nullif (trim (iParams->>'tags'), ''), ',')::int[];
    exception
      when others
      then
        perform error$.raise ('invalid_parameters', iDev_Message := '"tags" must be a list of integer');
    end;
  end if;

  vTotal := 0;
  vTotal_Planned := 0;
  vRN := 0;
  for r in (with 
              ctx as (select context.get('Id_Project')::int as Id_Project,
                             context.get('Id_User')::int as Id_User,
                             cf$_category.get_Category_by_Prototype(21) as Id_Category_Exchange,
                             cf$_category.get_Category_by_Prototype(22) as Id_Category_Exchange_Fee),
              p as (select Id_Account 
                      from cf$.v_Account),
              t_s as (select array (select t.Id_tag
                                      from cf$.v_Tag t
                                     where vSearchText is not null
                                       and upper(t.name) like upper('%' || vSearchText || '%')
                                   ) as tags
                     ),
              cfi as (select cf.Id_User,
                             cf.Id_CashFlow as Id_Exchange, 
                             cfd_from.DCashFlow_Detail as DExchange,
                             cfd_from.Report_Period, 
                             cf.Note,
                             cf.Tags,
                             cfd_from.Id_Account as  Id_Account_From,
                             cfd_from.Sum as Sum_From,
                             cfd_from.Id_Money as Id_Money_From,
                             cfd_to.Id_Account as Id_Account_To,
                             cfd_to.Sum as Sum_To,
                             cfd_to.Id_Money as id_Money_To,
                             cfd_fee.Id_Account as Id_Account_Fee,
                             cfd_fee.Sum as Fee,
                             cfd_fee.Id_Money as Id_Money_Fee,
                             null::int as Id_Plan, 
                             null::int as NRepeat,
                             null::text as Color_Mark
                        from ctx 
                             join cf$.CashFlow cf
                               on (    cf.Id_Project = ctx.Id_Project
                                   and cf.Id_CashFlow_Type = 4)
                             join cf$.CashFlow_Detail cfd_from
                               on (    cfd_from.Id_Project = cf.Id_Project
                                   and cfd_from.Id_CashFlow = cf.Id_CashFlow
                                   and cfd_from.Id_Category = ctx.Id_Category_Exchange
                                   and cfd_from.sign = -1)
                             join cf$.CashFlow_Detail cfd_to
                               on (    cfd_to.Id_Project = cf.Id_Project
                                   and cfd_to.Id_CashFlow = cf.Id_CashFlow
                                   and cfd_to.Id_Category = ctx.Id_Category_Exchange
                                   and cfd_to.sign = 1)
                             left join cf$.CashFlow_Detail cfd_fee
                               on (    cfd_fee.Id_Project = cf.Id_Project
                                   and cfd_fee.Id_CashFlow = cf.Id_CashFlow
                                   and cfd_fee.Id_Category = ctx.Id_Category_Exchange_Fee)
                       where (   vId_Exchange is null
                              or cf.Id_CashFlow = vId_Exchange)
                         and cfd_from.Id_Account in (select p.Id_Account from p)
                         and cfd_To.Id_Account in (select p.Id_Account from p)
                         and (   cfd_fee.Id_Account is null 
                              or cfd_fee.Id_Account in (select p.Id_Account from p))
                       union all 
                      select pe.Id_User,
                             null::int as Id_Exchange,
                             s.DPlan as DExchange,
                             s.Report_Period,
                             pe.Operation_Note as Note,
                             pe.Operation_Tags as Tags,
                             pe.Id_Account_From,
                             pe.Sum_From,
                             pe.Id_Money_From,
                             pe.Id_Account_To,
                             pe.Sum_To,
                             pe.Id_Money_To,
                             pe.Id_Account_Fee,
                             pe.Fee,
                             pe.Id_Money_Fee,
                             pe.Id_Plan, 
                             s.NRepeat,
                             pe.Color_Mark
                        from cf$.v_Plan_Exchange pe,
                             cf$_plan.schedule(pe.Id_Plan, pe.DBegin, (now() + interval '1 day')::date ) s
                       where vId_Exchange is null
                     )
            select cfi.Id_User,
                   cfi.Id_Exchange, 
                   cfi.DExchange,
                   cfi.Report_Period, 
                   cfi.Note,
                   cfi.Tags,
                   cfi.Id_Account_From,
                   cfi.Sum_From,
                   cfi.Id_Money_From,
                   cfi.Id_Account_To,
                   cfi.Sum_To,
                   cfi.Id_Money_To,
                   cfi.Id_Account_Fee,
                   cfi.Fee,
                   cfi.Id_Money_Fee,
                   cfi.Id_Plan,
                   cfi.NRepeat,
                   cfi.Color_Mark,
                   count(*) over() as Total,
                   count(*) filter (where cfi.Id_Plan is not null) over() as Total_Planned
              from cfi
             where (vDBegin is null or cfi.DExchange >= vDBegin)
               and (vDEnd is null or cfi.DExchange <= vDEnd)
               and (vAccountsFrom is null or cfi.Id_Account_From in (select unnest (vAccountsFrom)))
               and (vAccountsTo is null or cfi.Id_Account_To in (select unnest (vAccountsTo)))
               and (vTags is null or cfi.Tags && vTags)
               and (   vSearchText is null 
                    or upper(cfi.Note) like upper('%' || vSearchText || '%')
                    or cfi.Tags && (select Tags from t_s)
                   )
             order by case when cfi.Id_Plan is null then 1 else 0 end,
                      cfi.DExchange desc, 
                      cfi.Id_Exchange desc, 
                      cfi.Id_Plan desc)
  loop
    vTotal := r.Total;
    vTotal_Planned := r.Total_Planned;
    vRN := vRN + 1;
    exit when vRN > vOffset + vLimit or vOffset >= vTotal;
    continue when vRN <= vOffset;

    vResult := concat_ws (',', vResult,
                          json_build_object ('idUser', r.Id_User,
                                             'idExchange', r.Id_Exchange,
                                             'dExchange', json.format(r.DExchange),
                                             'reportPeriod', json.format(r.Report_Period),
                                             'note', coalesce(r.Note, ''),
                                             'idAccountFrom', r.Id_Account_From,
                                             'sumFrom', r.Sum_From,
                                             'idMoneyFrom', r.Id_Money_From,
                                             'idAccountTo', r.Id_Account_To,
                                             'sumTo', r.Sum_To,
                                             'idMoneyTo', r.Id_Money_To,
                                             'idAccountFee', r.Id_Account_Fee,
                                             'fee', r.Fee,
                                             'idMoneyFee', r.Id_Money_Fee,
                                             'tags', cf$_tag.encode(r.Tags),
                                             'idPlan', r.Id_Plan,
                                             'nRepeat', r.NRepeat,
                                             'colorMark', coalesce(r.Color_Mark, '')
                                            ));
  end loop;

  if vId_Exchange is null 
  then
    oResult := json.list (array ['exchanges', concat ('[', vResult , ']'), 
                                 'metadata', json_build_object ('total', vTotal,
                                                                'totalPlanned', vTotal_Planned,
                                                                'limit', vLimit,
                                                                'offset', vOffset
                                                                )::text
                                ]);
  else
    oResult := concat('"exchange"', ':', coalesce (vResult, '{}'));
  end if;
end;
$function$
