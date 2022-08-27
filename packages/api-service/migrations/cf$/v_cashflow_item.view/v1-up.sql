create view cf$."v_cashflow_item" as
select cfd.id_project as project_id,
       cfd.id_cashflow as cashflow_id,
       cfd.id_cashflow_detail as id,
       cfd.id_user as user_id,
       cfd.id_account as account_id,
       cfd.id_category as category_id,
       cfd.id_money as money_id,
       cfd.id_unit as unit_id,
       cfd.sign,
       cfd.dcashflow_detail as cashflow_item_date,
       cfd.report_period,
       cfd.quantity,
       cfd.sum as amount,
       cfd.note,
       cfd.tags,
       cfd.is_not_confirmed
  from "cf$".cashflow_detail cfd
