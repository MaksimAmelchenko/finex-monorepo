CREATE OR REPLACE VIEW cf$."v_plan_transfer" AS 
  WITH ap AS (
         SELECT p_1.id_project,
            p_1.id_account,
            p_1.permit
           FROM "cf$_account".permit() p_1(id_project, id_account, permit)
        )
 SELECT pt.id_project,
    pt.id_plan,
    pt.id_account_from,
    pt.id_account_to,
    pt.sum,
    pt.id_money,
    pt.id_account_fee,
    pt.fee,
    pt.id_money_fee,
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
   FROM ("cf$".plan_transfer pt
     JOIN "cf$".plan p USING (id_project, id_plan))
  WHERE ((((pt.id_project, pt.id_account_from) IN ( SELECT ap.id_project,
            ap.id_account
           FROM ap)) AND ((pt.id_project, pt.id_account_to) IN ( SELECT ap.id_project,
            ap.id_account
           FROM ap))) AND ((pt.id_account_fee IS NULL) OR ((pt.id_project, pt.id_account_fee) IN ( SELECT ap.id_project,
            ap.id_account
           FROM ap))));