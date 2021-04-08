CREATE OR REPLACE VIEW core$."v_user" AS 
  SELECT u.id_user,
    u.name,
    u.email
   FROM "core$"."user" u
  WHERE (u.id_household = (context."#get"('Id_Household'::text))::integer);
