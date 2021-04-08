CREATE OR REPLACE VIEW cf$."v_tag" AS 
  WITH ctx AS (
         SELECT (context.get('Id_Project'::text))::integer AS id_project
        )
 SELECT t.id_project,
    t.id_tag,
    t.id_user,
    t.name
   FROM ctx,
    "cf$".tag t
  WHERE (t.id_project = ctx.id_project);
