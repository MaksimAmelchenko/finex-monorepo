CREATE OR REPLACE VIEW cf$."v_account_permit" AS 
  WITH ctx AS (
         SELECT (context.get('Id_Project'::text))::integer AS id_project
        )
 SELECT ap.id_project,
    ap.id_account,
    ap.id_user,
    ap.permit
   FROM ctx,
    "cf$".account_permit ap
  WHERE (ap.id_project = ctx.id_project);