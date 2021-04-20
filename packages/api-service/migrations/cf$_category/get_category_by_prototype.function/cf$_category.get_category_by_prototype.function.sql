CREATE OR REPLACE FUNCTION "cf$_category".get_category_by_prototype(iid_category_prototype integer)
 RETURNS integer
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
select c.Id_Category 
  from cf$.v_Category c
 where c.Id_Category_Prototype = iId_Category_Prototype;
$function$
