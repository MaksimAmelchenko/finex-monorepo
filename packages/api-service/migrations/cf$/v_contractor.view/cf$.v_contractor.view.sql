CREATE OR REPLACE VIEW cf$."v_contractor" AS 
  WITH ctx AS (
         SELECT (context.get('Id_Project'::text))::integer AS id_project
        )
 SELECT c.id_project,
    c.id_contractor,
    c.id_user,
    c.name,
    c.note
   FROM ctx,
    "cf$".contractor c
  WHERE (c.id_project = ctx.id_project);
