create view cf$.v_plan_transaction as
select pcfi.id_project as project_id,
       pcfi.id_plan as plan_id,
       pcfi.sign,
       pcfi.sum as amount,
       pcfi.id_money as money_id,
       pcfi.id_category as category_id,
       pcfi.id_account as account_id,
       pcfi.id_contractor as contractor_id,
       pcfi.quantity,
       pcfi.id_unit as unit_id
  from cf$.plan_cashflow_item pcfi
