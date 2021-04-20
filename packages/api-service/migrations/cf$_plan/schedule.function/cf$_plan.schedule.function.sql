CREATE OR REPLACE FUNCTION "cf$_plan".schedule(iid_plan integer, idbegin date, idend date)
 RETURNS TABLE(id_plan integer, dplan date, report_period date, nrepeat integer)
 LANGUAGE sql
 SECURITY DEFINER ROWS 100
AS $function$
  with 
    p as (select p.dBegin,
                 p.Report_Period,
                 p.Repeat_Type,
                 p.Repeat_Days,
                 p.End_Type,
                 p.Repeat_Count,
                 p.DEnd
            from cf$.plan p
           where p.Id_Plan = iId_Plan
         ),
    o as (select (generate_series(p.DBegin, case when p.Repeat_Type = 0 
                                              then p.DBegin 
                                              else iDEnd 
                                            end, '1 day'))::date as DPlan
            from p
         ),
    f as (select DPlan, 
                 row_number() over (order by DPlan) as NRepeat
            from p, o
           where case when p.Repeat_Type = 0 
                 then
                   DPlan = p.DBegin 
                 else
                  case when p.Repeat_Type = 1
                  then
                    -- еженедельно
                    extract(isodow from o.DPlan) = any (p.Repeat_Days)
                  else
                    case when p.Repeat_Type = 2
                    then
                      -- ежемесячно
                      extract(day from o.DPlan) = any (p.Repeat_Days)
                    else
                      case when p.Repeat_Type = 3
                      then
                        -- ежеквартально
                            extract(day from p.DBegin) = extract(day from o.DPlan)
                        and extract(month from p.DBegin)::int % 3 = extract(month from o.DPlan)::int % 3
                      else
                        case when p.Repeat_Type = 4
                        then
                          to_char(p.DBegin, 'MMDD') = to_char(o.DPlan, 'MMDD')
                        else
                          false
                        end
                      end
                    end
                  end
                 end 
         )
  select iid_Plan, 
         f.DPlan,
         (date_trunc('month', f.DPlan)
           + ((  (extract (year from p.Report_Period) * 12 + extract (month from p.Report_Period))::int 
               - (extract (year from p.DBegin) * 12 + extract (month from p.DBegin))::int)::text || ' months'
             )::interval
         )::date as Report_Period,
         NRepeat::int
    from f, p
   where (   coalesce(p.End_Type, 0) = 0
          or (p.End_Type = 1 and NRepeat <= p.Repeat_Count)
          or (p.End_Type = 2 and f.DPlan <= p.DEnd)
         ) 
     and f.DPlan between iDBegin and iDEnd
     and f.DPlan not in (select pe.DExclude
                           from cf$.v_Plan_Exclude pe
                          where pe.Id_Plan = iId_Plan);
$function$
