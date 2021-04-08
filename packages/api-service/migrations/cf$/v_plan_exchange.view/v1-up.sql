CREATE OR REPLACE VIEW cf$."v_plan_exchange" AS 
  WITH ap AS (
         SELECT p_1.id_project,
            p_1.id_account,
            p_1.permit
           FROM "cf$_account".permit() p_1(id_project, id_account, permit)
        )
 SELECT pe.id_project,
    pe.id_plan,
    pe.id_account_from,
    pe.sum_from,
    pe.id_money_from,
    pe.id_account_to,
    pe.sum_to,
    pe.id_money_to,
    pe.id_account_fee,
    pe.fee,
    pe.id_money_fee,
    p.id_user,
    p.dbegin,
    p.report_period,
    p.operation_note,
    p.operation_tags,
    p.repeat_type,
    p.repeat_days,
    p.end_type,
    p.repeat_count,
    p.dend,
    p.color_mark,
    p.note
   FROM ("cf$".plan_exchange pe
     JOIN "cf$".plan p USING (id_project, id_plan))
  WHERE (((pe.id_project, pe.id_account_from) IN ( SELECT ap.id_project,
            ap.id_account
           FROM ap)) AND ((pe.id_project, pe.id_account_to) IN ( SELECT ap.id_project,
            ap.id_account
           FROM ap)) AND ((pe.id_account_fee IS NULL) OR ((pe.id_project, pe.id_account_fee) IN ( SELECT ap.id_project,
            ap.id_account
           FROM ap))));
