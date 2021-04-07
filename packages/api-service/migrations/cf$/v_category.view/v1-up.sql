CREATE OR REPLACE VIEW cf$."v_category" AS 
  WITH ctx AS (
         SELECT (context.get('Id_Project'::text))::integer AS id_project
        )
 SELECT c.id_project,
    c.id_category,
    c.id_user,
    c.parent,
    c.id_category_prototype,
    c.id_unit,
    c.is_enabled,
    c.is_system,
    c.name,
    c.note
   FROM (ctx
     JOIN "cf$".category c USING (id_project));