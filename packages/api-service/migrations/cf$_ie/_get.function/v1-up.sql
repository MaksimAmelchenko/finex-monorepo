CREATE OR REPLACE FUNCTION "cf$_ie"."#get"(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  r          record;

  vId_IE     cf$.v_CashFlow.Id_CashFlow%type;
  vId_IE_Cur cf$.v_CashFlow.Id_CashFlow%type;

  vResult    text;
  vIEDetail  text;
  vIE        text[];

  vLimit     integer;
  vOffset    integer;
  
  vLimit_Default int := 10;
  vOffset_Default int := 0;

  vFilter json;
  vTotal int;
begin

  begin
    vId_IE := (iParams->>'idIE')::int;
    vLimit := coalesce((iParams->>'limit')::int, vLimit_Default);
    vOffset := coalesce((iParams->>'offset')::int, vOffset_Default);
    vFilter := iParams->'filter';
  exception
    when others
    then
      perform error$.raise ('invalid_parameters');
  end;

  if vLimit < 0 and vLimit > 100 then
    vLimit := vLimit_Default;
  end if;
  
  if vOffset < 0 then
    vOffset := vOffset_Default;
  end if;
  
  vId_IE_Cur := -1;
  vTotal := 0;
  for r in (select a.*,
                   max (rank) over () as Total 
              from (select dense_rank() over ( order by coalesce (cfd.DLast,  cf.DSet)  desc, cf.Id_Cashflow desc) as rank,
                           --
                           cf.Id_CashFlow,
                           cf.DSet,
                           cf.Id_Counteragent,
                           cf.Note as CashFlow_Note,
                           cf.Id_User as CashFlow_Id_User,
                           cf.tags as CashFlow_Tags,
                           --
                           cfd.Id_CashFlow_Detail,
                           cfd.Id_User,
                           cfd.Id_Account,
                           cfd.Id_CashFlow_Item,
                           cfd.Id_Currency,
                           cfd.Id_Unit,
                           cfd.DCashFlow_Detail,
                           cfd.Report_Period,
                           cfd.Sign,
                           cfd.Quantity,
                           cfd.Summa,
                           cfd.Note,
                           cfd.tags
                      from cf$.CashFlow cf
                           left join  (select cfdi.*,
                                              max (cfdi.DCashFlow_Detail) over (partition by cfdi.Id_CashFlow ) as DLast
                                         from cf$.v_CashFlow_Detail cfdi) cfd
                             on (cfd.Id_CashFlow = cf.Id_CashFlow)
                     where (   (    cfd.Id_CashFlow_Detail is null
                                and cf.Id_User = context.get('Id_User')::int)
                            or cfd.Id_CashFlow_Detail is not null)
                       and cf.Id_CashFlow_Type = 1
                       and cf.Id_Project = context.get('Id_Project')::int
                       and cf.Id_CashFlow = coalesce(vId_IE, cf.Id_CashFlow)
                     order by coalesce (cfd.DLast,  cf.DSet)  desc, cf.Id_Cashflow desc) a)
--              where a.Rank between vOffset + 1 and vOffset + vLimit;
  loop
    -- Не использовал условие where c Rank, т.к. нужно в любом случае получить Total, даже если указали запредельное смещение
    vTotal = r.Total;
    exit when r.Rank > vOffset + vLimit or vOffset >= vTotal;
    continue when r.Rank <= vOffset;

    if r.Id_CashFlow != vId_IE_Cur then
      vId_IE_Cur := r.Id_CashFlow;

      if vIE != '{}' then
        vResult := concat_ws (',', vResult,
                              json.object (vIE || array ['ieDetails', concat('[', vIEDetail, ']')]));
        vIEDetail := null;                                
      end if;                                

      vIE := array ['idUser', json.to_json(r.CashFlow_Id_User),
                    'idIE', json.to_json(r.Id_CashFlow),
                    'dSet', json.to_json(r.DSet),
                    'idCounteragent', json.to_json(r.Id_Counteragent),
                    'note', json.to_json(r.CashFlow_Note),
                    'tags', concat ('[', array_to_string (r.CashFlow_Tags, ',') ,']')
                    ];
    end if;  
  
    if r.Id_CashFlow_Detail is not null then
      vIEDetail := concat_ws (',', vIEDetail,
                            json_build_object ('idUser', r.Id_User,
                                               'idIEDetail', r.Id_CashFlow_Detail,
                                               'idAccount', r.Id_Account,
                                               'idIEItem', r.Id_CashFlow_Item,
                                               'idCurrency', r.Id_Currency,
                                               'idUnit', r.Id_Unit,
                                               'sign', r.Sign,
                                               'dIEDetail', r.DCashFlow_Detail,
                                               'reportPeriod', r.Report_Period,
                                               'quantity', r.Quantity,
                                               'summa', r.Summa,
                                               'note', r.Note,
                                               'tags', r.Tags
                                              ));
    end if;                                                
  end loop;

  if vIE != '{}' then
    vResult := concat_ws (',', vResult,
                          json.object (vIE || array ['ieDetails', concat('[', vIEDetail, ']')]));
  end if;                                


  if vId_IE is  null then
    oResult := json.list ( array ['ies', concat ('[', vResult , ']'), 
                                  'metadata', json_build_object ('total', vTotal,
                                                                 'limit', vLimit,
                                                                 'offset', vOffset
                                                                 )::text
                                 ]);
  else
--    oResult := json.object ( array ['ie', vResult]);
    oResult := concat ('"ie"', ':', coalesce(vResult, '{}'));
  end if;
end;
$function$
