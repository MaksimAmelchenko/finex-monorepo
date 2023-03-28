create or replace function "cf$_category".get_categories_recursive(_project_id int, _categories int[])
  returns table
          (
            category_id integer
          )
  language sql
  stable rows 50
as
$function$
  with recursive ct (id_category) as (
    select c.id_category
      from cf$.category c
     where c.id_project = _project_id
       and c.id_category in (select unnest(_categories))
     union all
    select c.id_category
      from ct,
           cf$.category c
     where c.id_project = _project_id
       and c.parent = ct.id_category)
select ct.id_category from ct
$function$
