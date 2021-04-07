CREATE OR REPLACE VIEW cf$."v_cashflow" AS 
  WITH ctx AS (
         SELECT (context.get('Id_Project'::text))::integer AS id_project,
            (context.get('Id_User'::text))::integer AS id_user
        )
 SELECT cf.id_project,
    cf.id_cashflow,
    cf.id_user,
    cf.id_contractor,
    cf.id_cashflow_type,
    cf.note,
    cf.dset,
    cf.tags
   FROM ctx,
    "cf$".cashflow cf
  WHERE (((cf.id_user = ctx.id_user) OR (EXISTS ( SELECT 1
           FROM "cf$".v_cashflow_detail cfd
          WHERE (cfd.id_cashflow = cf.id_cashflow)
         LIMIT 1))) AND (cf.id_project = ctx.id_project));