CREATE OR REPLACE FUNCTION "cf$_category".full_name(iid_category integer, idelimiter text DEFAULT '/'::text, iid_project integer DEFAULT (context.get('Id_Project'::text))::integer)
 RETURNS text
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
with recursive
  ct as (select c.Id_Category, 
                c.Name, 
                c.Parent, 
                array[c.name] as Path
           from cf$.Category c  
          where c.Id_Project = iId_Project
            and c.Id_Category = iId_Category
          union all
         select c.Id_Category, 
                c.Name, 
                c.Parent, 
                array[c.Name] || ct.Path
           from ct, cf$.Category c
          where c.Id_Project = iId_Project  
            and c.Id_Category = ct.Parent)
select array_to_string (ct.Path, iDelimiter)
  from ct
 where Parent is null;
$function$
