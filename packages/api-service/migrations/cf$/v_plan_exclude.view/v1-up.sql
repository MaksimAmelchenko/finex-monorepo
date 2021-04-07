CREATE OR REPLACE VIEW cf$."v_plan_exclude" AS 
  WITH ctx AS (
         SELECT (context.get('Id_Project'::text))::integer AS id_project
        )
 SELECT plan_exclude.id_project,
    plan_exclude.id_plan,
    plan_exclude.id_user,
    plan_exclude.dexclude,
    plan_exclude.action_type
   FROM (ctx
     JOIN "cf$".plan_exclude USING (id_project));