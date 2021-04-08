CREATE OR REPLACE VIEW cf$."v_project" AS 
  SELECT p.id_project,
    p.id_user,
    p.name,
    p.note,
    prm.permit
   FROM ("cf$_project".permit() prm(id_project, permit)
     JOIN "cf$".project p ON ((p.id_project = prm.id_project)));
