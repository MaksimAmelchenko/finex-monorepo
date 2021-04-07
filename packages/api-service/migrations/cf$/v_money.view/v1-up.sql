CREATE OR REPLACE VIEW cf$."v_money" AS 
  WITH ctx AS (
         SELECT (context.get('Id_Project'::text))::integer AS id_project
        )
 SELECT m.id_project,
    m.id_money,
    m.id_user,
    m.id_currency,
    m.name,
    m.symbol,
    m.is_enabled,
    m.sorting,
    m."precision"
   FROM (ctx
     JOIN "cf$".money m USING (id_project));