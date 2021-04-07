CREATE OR REPLACE VIEW cf$."v_plan_cashflow_item" AS 
  SELECT pcfi.id_project,
    pcfi.id_plan,
    pcfi.id_contractor,
    pcfi.id_account,
    pcfi.id_category,
    pcfi.id_money,
    pcfi.id_unit,
    pcfi.sign,
    pcfi.quantity,
    pcfi.sum,
    prmt.permit,
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
   FROM (("cf$_account".permit() prmt(id_project, id_account, permit)
     JOIN "cf$".plan_cashflow_item pcfi USING (id_project, id_account))
     JOIN "cf$".plan p USING (id_project, id_plan));