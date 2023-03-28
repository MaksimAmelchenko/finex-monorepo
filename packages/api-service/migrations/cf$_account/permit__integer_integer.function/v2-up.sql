create or replace function "cf$_account".permit(_project_id integer, _user_id integer)
  returns table
          (
            project_id integer,
            account_id integer,
            permit     integer
          )
  language sql
  stable rows 50
as
$function$
select a.id_project,
       a.id_account,
       7 as permit
  from cf$.account a
 where a.id_project = _project_id
   and a.Id_user = _user_id
 union all
select ap.id_project,
       ap.id_account,
       ap.permit
  from cf$.account_permit ap
 where ap.id_project = _project_id
   and ap.id_user = _user_id
$function$
