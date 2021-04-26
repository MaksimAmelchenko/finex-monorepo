CREATE OR REPLACE FUNCTION "cf$_account".permit(_id_project integer, _id_user integer)
 RETURNS TABLE(id_project integer, id_account integer, permit integer)
 LANGUAGE sql
 STABLE ROWS 50
AS $function$
select a.id_project,
       a.id_account,
       7 as permit
  from cf$.account a
 where a.id_project = _id_project
   and a.Id_user = _id_user
 union all
select ap.id_project,
       ap.id_account,
       ap.permit
  from cf$.account_permit ap
 where ap.id_user = _id_user
   and ap.id_project = _id_project
$function$
