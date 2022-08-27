create or replace view cf$."v_cashflow_v2" as
select cf.id_project as "project_id",
       cf.id_cashflow as "id",
       cf.id_user as "user_id",
       cf.id_contractor as "contractor_id",
       cf.id_cashflow_type as "cashflow_type_id",
       cf.note,
       cf.dset as updated_at,
       cf.tags
  from "cf$".cashflow cf
