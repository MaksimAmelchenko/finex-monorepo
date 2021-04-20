CREATE OR REPLACE FUNCTION "cf$_transfer".get(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  r          record;

  vId_Transfer cf$.v_CashFlow.Id_CashFlow%type;

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
  vRN            int;
  vTotal         int;
  vTotal_Planned int;
begin

  begin
    vId_Transfer := iParams->>'idTransfer';
    vLimit := coalesce((iParams->>'limit')::int, vLimit_Default);
    vOffset := coalesce((iParams->>'offset')::int, vOffset_Default);
  exception
    when others
    then
      perform error$.raise ('invalid_parameters');
  end;

  vSearchText := sanitize$.to_String (iParams->>'searchText');

  if (iParams \? 'dBegin') 
  then
    begin
      vDBegin := sanitize$.to_date (iParams->>'dBegin');
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"dBegin" must be a date');
    end;
  end if;

  if (iParams \? 'dEnd') 
  then
    begin
      vDEnd := sanitize$.to_date (iParams->>'dEnd');
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"dEnd" must be a date');
    end;
  end if;
  
  
  if (iParams \? 'accountsFrom') 
  then
    begin
      vAccountsFrom := string_to_array (nullif (trim (iParams->>'accountsFrom'), ''), ',')::int[];
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"accountsFrom" must be a list of integer');
    end;
  end if;

  if (iParams \? 'accountsTo') 
  then
    begin
      vAccountsTo := string_to_array (nullif (trim (iParams->>'accountsTo'), ''), ',')::int[];
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"accountsTo" must be a list of integer');
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
  for r in (
            with ctx as (select context.get('Id_Project')::int as Id_Project,
                                context.get('Id_User')::int as Id_User,
                                (select c.Id_Category
                                   from cf$.v_Category c
                                  where c.Id_Category_Prototype = 11) as Id_Category_Transfer,
                                (select c.Id_CaTegory
                                   from cf$.v_Category c
                                  where c.Id_Category_Prototype = 12) as Id_Category_Transfer_Fee
                                ),
                 p as (select Id_Account 
                         from cf$.v_Account),
                 t_s as (select array (select t.Id_tag
                                         from cf$.v_Tag t
                                        where vSearchText is not null
                                          and upper(t.name) like upper('%' || vSearchText || '%')
                                      ) as tags),
                 cfi as (select cf.Id_User,
                                cf.Id_CashFlow as Id_Transfer, 
                                cfd_from.DCashFlow_Detail as DTransfer,
                                cfd_from.Report_Period, 
                                cf.Note,
                                cf.Tags,
                                cfd_from.Id_Account Id_Account_From,
                                cfd_to.Id_Account as Id_Account_To,
                                cfd_from.Sum,
                                cfd_from.Id_Money,
                                cfd_fee.Id_Account as Id_Account_Fee,
                                cfd_fee.Sum as Fee,
                                cfd_fee.Id_Money as Id_Money_Fee,
                                null::int as Id_Plan, 
                                null::int as NRepeat,
                                null::text as Color_Mark
                           from ctx
                                join cf$.CashFlow cf 
                                  on (    cf.Id_Project = ctx.Id_Project
                                      and cf.Id_CashFlow_Type = 3)
                                join cf$.CashFlow_Detail cfd_from
                                  on (    cfd_from.Id_Project = cf.Id_Project
                                      and cfd_from.Id_CashFlow = cf.Id_CashFlow
                                      and cfd_from.Id_Category = ctx.Id_Category_Transfer
                                      and cfd_from.sign = -1)
                                join cf$.CashFlow_Detail cfd_to
                                  on (    cfd_to.Id_Project = cf.Id_Project
                                      and cfd_to.Id_CashFlow = cf.Id_CashFlow
                                      and cfd_to.Id_Category = ctx.Id_Category_Transfer
                                      and cfd_to.sign = 1)
                                left join cf$.CashFlow_Detail cfd_fee
                                  on (    cfd_fee.Id_Project = cf.Id_Project
                                      and cfd_fee.Id_CashFlow = cf.Id_CashFlow
                                      and cfd_fee.Id_Category = ctx.Id_Category_Transfer_Fee)
                          where (cf.Id_CashFlow = vId_Transfer or vId_Transfer is null)
                            and cfd_from.Id_Account in (select p.Id_Account from p)
                            and cfd_To.Id_Account in (select p.Id_Account from p)
                            and (cfd_fee.Id_Account is null or cfd_fee.Id_Account in (select p.Id_Account from p))
                          union all 
                         select pt.Id_User,
                                null as Id_Transfer,
                                s.DPlan as DTransfer,
                                s.Report_Period,
                                pt.Operation_Note as Note,
                                pt.Operation_Tags as Tags,
                                pt.Id_Account_From,
                                pt.Id_Account_To,
                                pt.Sum,
                                pt.Id_Money,
                                pt.Id_Account_Fee,
                                pt.Fee,
                                pt.Id_Money_Fee,
                                pt.Id_Plan, 
                                s.NRepeat,
                                pt.Color_Mark
                           from cf$.v_Plan_Transfer pt,
                                cf$_plan.schedule(pt.Id_Plan, pt.DBegin, (now() + interval '1 day')::date ) s
                          where vId_Transfer is null
                 )
            select cfi.Id_User,
                   cfi.Id_Transfer, 
                   cfi.DTransfer,
                   cfi.Report_Period, 
                   cfi.Note,
                   cfi.Tags,
                   cfi.Id_Account_From,
                   cfi.Id_Account_To,
                   cfi.Sum,
                   cfi.Id_Money,
                   cfi.Id_Account_Fee,
                   cfi.Fee,
                   cfi.Id_Money_Fee,
                   cfi.Id_Plan,
                   cfi.NRepeat,
                   cfi.Color_Mark,
                   count(*) over() as Total,
                   count(*) filter (where cfi.Id_Plan is not null) over() as Total_Planned
              from cfi
             where (vDBegin is null or cfi.DTransfer >= vDBegin)
               and (vDEnd is null or cfi.DTransfer <= vDEnd)
               and (vAccountsFrom is null or cfi.Id_Account_From in (select unnest (vAccountsFrom)))
               and (vAccountsTo is null or cfi.Id_Account_To in (select unnest (vAccountsTo)))
               and (vTags is null or cfi.tags && vTags)
               and (   vSearchText is null 
                    or upper(cfi.Note) like upper('%' || vSearchText || '%')
                    or cfi.Tags && (select tags from t_s)
                   )
             order by case when cfi.Id_Plan is null then 1 else 0 end,
                      cfi.DTransfer desc, 
                      cfi.Id_Transfer desc, 
                      cfi.Id_Plan desc)
  loop
    vTotal = r.Total;
    vTotal_Planned := r.Total_Planned;
    vRN := vRN + 1;
    exit when vRN > vOffset + vLimit or vOffset >= vTotal;
    continue when vRN <= vOffset;

    vResult := concat_ws (',', vResult,
                          json_build_object ('idUser', r.Id_User,
                                             'idTransfer', r.Id_Transfer,
                                             'dTransfer', json.format(r.DTransfer),
                                             'reportPeriod', json.format(r.Report_Period),
                                             'idAccountFrom', r.Id_Account_From,
                                             'idAccountTo', r.Id_Account_To,
                                             'sum', r.Sum,
                                             'idMoney', r.Id_Money,
                                             'isFee', r.Id_Account_Fee is not null,
                                             'idAccountFee', r.Id_Account_Fee,
                                             'fee', r.Fee,
                                             'idMoneyFee', r.Id_Money_Fee,
                                             'note', coalesce(r.Note, ''),
                                             'tags', cf$_tag.encode(r.Tags),
                                             'idPlan', r.Id_Plan,
                                             'nRepeat', r.NRepeat,
                                             'colorMark', coalesce(r.Color_Mark, '')
                                            ));
  end loop;

  if vId_Transfer is  null 
  then
    oResult := json.list ( array ['transfers', concat ('[', vResult , ']'), 
                                  'metadata', json_build_object ('total', vTotal,
                                                                 'totalPlanned', vTotal_Planned,
                                                                 'limit', vLimit,
                                                                 'offset', vOffset
                                                                 )::text
                                 ]);
  else
    oResult := concat('"transfer"', ':', coalesce (vResult, '{}'));
  end if;
end;
$function$
