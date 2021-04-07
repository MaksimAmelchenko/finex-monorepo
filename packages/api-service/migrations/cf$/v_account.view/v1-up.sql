CREATE OR REPLACE VIEW cf$."v_account" AS 
  SELECT a.id_user,
    a.id_account,
    a.id_account_type,
    a.name,
    p.permit,
    a.is_enabled,
    a.note,
    a.id_project
   FROM ("cf$_account".permit() p(id_project, id_account, permit)
     JOIN "cf$".account a ON (((a.id_project = p.id_project) AND (a.id_account = p.id_account))));