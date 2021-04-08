CREATE OR REPLACE VIEW cf$."v_invitation" AS 
  SELECT i.id_invitation,
    i.id_user_host,
    i.email_host,
    i.message,
    i.dset
   FROM "cf$".invitation i
  WHERE (i.id_user_guest = (context.get('Id_User'::text))::integer);
