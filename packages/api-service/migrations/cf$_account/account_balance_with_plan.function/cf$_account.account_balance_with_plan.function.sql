create or replace function "cf$_account".account_balance_with_plan(p_project_id integer, p_user_id integer, p_end_date date)
  returns table
          (
            project_id   integer,
            account_id   integer,
            balance_date date,
            money_id     integer,
            amount_in    numeric,
            amount_out   numeric
          )
  language sql
  security definer
as
$function$
  with
    --
    permit as (
      select project_id,
             account_id,
             permit
        from cf$_account.permit(p_project_id, p_user_id)
    ),
    pt as (
      select pt.id_project as project_id,
             pt.id_account_from as from_account_id,
             pt.id_account_to as to_account_id,
             pt.id_account_fee as fee_account_id,
             pt.id_money as money_id,
             pt.sum as amount,
             pt.id_money_fee as fee_money_id,
             pt.fee,
             p.id as plan_id,
             p.start_date
        from cf$.plan_transfer pt
               join cf$.v_plan_v2 p
                    on (p.project_id = pt.id_project
                      and p.id = pt.id_plan)
       where pt.id_project = p_project_id
    ),
    pe as (
      select pe.id_project as project_id,
             pe.id_account_from as from_account_id,
             pe.id_account_to as to_account_id,
             pe.id_account_fee as fee_account_id,
             pe.id_money_from as from_money_id,
             pe.id_money_to as to_money_id,
             pe.id_money_fee as fee_money_id,
             pe.sum_from as from_amount,
             pe.sum_to as to_amount,
             pe.fee,
             p.id as plan_id,
             p.start_date
        from cf$.plan_exchange pe
               join cf$.v_plan_v2 p
                    on (p.project_id = pe.id_project
                      and p.id = pe.id_plan)
       where pe.id_project = p_project_id
    ),
    o as (
      select ab.id_account as account_id,
             ab.dbalance as balance_date,
             ab.id_money as money_id,
             ab.sum_in as amount_in,
             ab.sum_out as amount_out
        from permit
               join cf$.account_balance ab
                    on (ab.id_project = permit.project_id
                      and ab.id_account = permit.account_id)
       where ab.dbalance <= p_end_date
       union all
-- income and expense
      select pcfi.id_account as account_id,
             s.plan_date as balance_date,
             pcfi.id_money as money_id,
             case when pcfi.sign = 1 then pcfi.sum else 0 end as amount_in,
             case when pcfi.sign = -1 then pcfi.sum else 0 end as amount_out
        from permit
               join cf$.plan_cashflow_item pcfi
                    on (pcfi.id_project = permit.project_id
                      and pcfi.id_account = permit.account_id)
               join cf$.v_plan_v2 p
                    on (p.project_id = pcfi.id_project
                      and p.id = pcfi.id_plan)
               join cf$_plan.schedule(p.project_id, p.id, p.start_date, p_end_date) s
                    on (true)
       union all
 -- transfer
      select pt.from_account_id as account_id,
             s.plan_date as balance_date,
             pt.money_id,
             0 as amount_in,
             pt.amount as amount_out
        from permit
               join pt
                    on (pt.project_id = permit.project_id
                      and pt.from_account_id = permit.account_id)
               join cf$_plan.schedule(pt.project_id, pt.plan_id, pt.start_date, p_end_date) s
                    on (true)
       union all
      select pt.fee_account_id as account_id,
             s.plan_date as balance_date,
             pt.fee_money_id as money_id,
             0 as amount_in,
             pt.fee as amount_out
        from permit
               join pt
                    on (pt.project_id = permit.project_id
                      and pt.fee_account_id = permit.account_id)
               join cf$_plan.schedule(pt.project_id, pt.plan_id, pt.start_date, p_end_date) s
                    on (true)
       union all
      select pt.to_account_id as account_id,
             s.plan_date as balance_date,
             pt.money_id,
             pt.amount as amount_in,
             0 as amount_out
        from permit
               join pt
                    on (pt.project_id = permit.project_id
                      and pt.to_account_id = permit.account_id)
               join cf$_plan.schedule(pt.project_id, pt.plan_id, pt.start_date, p_end_date) s
                    on (true)
       union all
 -- exchange
      select pe.from_account_id as account_id,
             s.plan_date as balance_date,
             pe.from_money_id as money_id,
             0 as amount_in,
             pe.from_amount as amount_out
        from permit
               join pe
                    on (pe.project_id = permit.project_id
                      and pe.from_account_id = permit.account_id)
               join cf$_plan.schedule(pe.project_id, pe.plan_id, pe.start_date, p_end_date) s
                    on (true)
       union all
      select pe.fee_account_id as account_id,
             s.plan_date as balance_date,
             pe.fee_money_id as money_id,
             0 as amount_in,
             pe.fee as amount_out
        from permit
               join pe
                    on (pe.project_id = permit.project_id
                      and pe.fee_account_id = permit.account_id)
               join cf$_plan.schedule(pe.project_id, pe.plan_id, pe.start_date, p_end_date) s
                    on (1 = 1)
       union all
      select pe.to_account_id as account_id,
             s.plan_date as balance_date,
             pe.to_money_id as money_id,
             pe.to_amount as amount_in,
             0 as amount_out
        from permit
               join pe
                    on (pe.project_id = permit.project_id
                      and pe.to_account_id = permit.account_id)
               join cf$_plan.schedule(pe.project_id, pe.plan_id, pe.start_date, p_end_date) s
                    on (true)
    )
select p_project_id,
       account_id,
       balance_date,
       money_id,
       sum(amount_in) as amount_in,
       sum(amount_out) as amount_out
  from o
 group by account_id,
          money_id,
          balance_date
$function$
