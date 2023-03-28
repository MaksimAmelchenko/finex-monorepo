create or replace function "cf$_category".get_categories_recursive(_project_id int, _term text)
  returns table
          (
            category_id integer
          )
  language sql
  stable rows 50
as
$function$
  with
    recursive ct as (
    select c.id_category
      from cf$.category c
     where c.id_project = _project_id
       and _term is not null
       and upper(c.name) like upper('%' || _term || '%')
     union all
    select c.id_category
      from ct,
           cf$.category c
     where c.id_project = _project_id
       and c.parent = ct.id_category)
select ct.id_category
  from ct
$function$
