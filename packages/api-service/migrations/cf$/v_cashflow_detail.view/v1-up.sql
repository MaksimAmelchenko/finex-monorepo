CREATE OR REPLACE VIEW cf$."v_cashflow_detail" AS 
  SELECT cfd.id_project,
    cfd.id_cashflow,
    cfd.id_cashflow_detail,
    cfd.id_user,
    cfd.id_account,
    cfd.id_category,
    cfd.id_money,
    cfd.id_unit,
    cfd.sign,
    cfd.dcashflow_detail,
    cfd.report_period,
    cfd.quantity,
    cfd.sum,
    cfd.note,
    p.permit,
    cfd.tags,
    cfd.is_not_confirmed
   FROM ("cf$_account".permit() p(id_project, id_account, permit)
     JOIN "cf$".cashflow_detail cfd USING (id_project, id_account));