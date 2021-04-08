CREATE OR REPLACE VIEW cf$."v_unit" AS 
  WITH ctx AS (
         SELECT (context.get('Id_Project'::text))::integer AS id_project
        )
 SELECT u.id_project,
    u.id_unit,
    u.id_user,
    u.name
   FROM ctx,
    "cf$".unit u
  WHERE (u.id_project = ctx.id_project);
