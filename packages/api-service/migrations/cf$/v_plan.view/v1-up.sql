CREATE OR REPLACE VIEW cf$."v_plan" AS 
  WITH ctx AS (
         SELECT (context.get('Id_Project'::text))::integer AS id_project
        )
 SELECT p.id_project,
    p.id_plan,
    p.id_user,
    p.dbegin,
    p.report_period,
    p.operation_note,
    p.operation_tags,
    p.repeat_type,
    p.repeat_days,
    p.end_type,
    p.repeat_count,
    p.dend,
    p.color_mark,
    p.note
   FROM (ctx
     JOIN "cf$".plan p USING (id_project));
