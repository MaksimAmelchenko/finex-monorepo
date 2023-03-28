create or replace function "cf$_tag".get_tags(_project_id int, _term text)
  returns table
          (
            tag_id integer
          )
  language sql
  stable rows 5
as
$function$
select t.id_tag
  from cf$.tag t
 where t.id_project = _project_id
   and _term is not null
   and upper(t.name) like upper('%' || _term || '%')
$function$
