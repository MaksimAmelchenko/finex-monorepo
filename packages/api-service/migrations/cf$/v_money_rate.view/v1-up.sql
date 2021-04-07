CREATE OR REPLACE VIEW cf$."v_money_rate" AS 
  WITH ctx AS (
         SELECT (context.get('Id_Project'::text))::integer AS id_project
        )
 SELECT mr.id_project,
    mr.id_money_rate,
    mr.id_money,
    mr.drate,
    mr.id_currency,
    mr.rate
   FROM ("cf$".money_rate mr
     JOIN ctx USING (id_project));