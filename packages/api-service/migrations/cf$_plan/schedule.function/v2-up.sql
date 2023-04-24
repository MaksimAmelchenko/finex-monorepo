create or replace function "cf$_plan".schedule(p_project_id integer,
                                               p_plan_id integer,
                                               p_begin_date date,
                                               p_end_date date)
  returns table
          (
            project_id        integer,
            plan_id           integer,
            plan_date         date,
            report_period     date,
            repetition_number integer
          )
  language sql
  security definer rows 100
as
$function$
  with
    --
    p as (
      select p.id,
             p.start_date,
             p.report_period,
             p.repetition_type,
             p.repetition_days,
             p.termination_type,
             p.repetition_count,
             p.end_date
        from cf$.v_plan_v2 p
       where p.project_id = p_project_id
         and p.id = p_plan_id
    ),
    o as (
      select (generate_series(p.start_date,
                              case
                                when p.repetition_type = 0 then
                                  -- do not repeat
                                  p.start_date
                                else
                                  p_end_date
                                end,
                              '1 day'))::date as plan_date
        from p
    ),
    f as (
      select o.plan_date,
             row_number() over (order by o.plan_date) as repetition_number
        from p,
             o
       where case
               when p.repetition_type = 0 then
                 o.plan_date = p.start_date
               else
                 case
                   when p.repetition_type = 1 then
                     -- daily
                     extract(isodow from o.plan_date) = any (p.repetition_days)
                   else
                     case
                       when p.repetition_type = 2 then
                         -- monthly
                         extract(day from o.plan_date) = any (p.repetition_days)
                       else
                         case
                           when p.repetition_type = 3 then
                             -- quarterly
                               extract(day from p.start_date) = extract(day from o.plan_date)
                               and extract(month from p.start_date)::int % 3 = extract(month from o.plan_date)::int % 3
                           else
                             case
                               when p.repetition_type = 4 then
                                 -- yearly
                                 to_char(p.start_date, 'MMDD') = to_char(o.plan_date, 'MMDD')
                               else
                                 false
                               end
                           end
                       end
                   end
               end
    )
select p_project_id,
       p.id as plan_id,
       f.plan_date,
       (date_trunc('month', f.plan_date)
         + (((extract(year from p.report_period) * 12 + extract(month from p.report_period))::int
           - (extract(year from p.start_date) * 12 + extract(month from p.start_date))::int)::text || ' months'
          )::interval
         )::date as report_period,
       f.repetition_number
  from f,
       p
 where (
     coalesce(p.termination_type, 0) = 0
     or (p.termination_type = 1 and f.repetition_number <= p.repetition_count)
     or (p.termination_type = 2 and f.plan_date <= p.end_date)
   )
   and f.plan_date between p_begin_date and p_end_date
   and f.plan_date not in (select pe.dexclude
                             from cf$.plan_exclude pe
                            where pe.id_project = p_project_id
                              and pe.Id_Plan = p_plan_id);
$function$
