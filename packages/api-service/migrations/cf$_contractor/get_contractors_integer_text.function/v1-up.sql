create or replace function "cf$_contractor".get_contractors(_project_id int, _term text)
  returns table
          (
            contractor_id integer
          )
  language sql
  stable rows 5
as
$function$
select c.id_contractor
  from cf$.contractor c
 where c.id_project = _project_id
   and _term is not null
   and upper(c.name) like upper('%' || _term || '%')
$function$
