CREATE OR REPLACE FUNCTION "cf$_category".get_empty_category()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vId_Category cf$.Category.Id_Category%type;
begin
  select c.Id_Category
    into vId_Category
    from cf$.v_Category c
   where c.Id_Category_Prototype = 210
     and c.Parent is null;

  if vId_Category is null then
    insert into cf$.Category (Name, parent, Id_Category_Prototype)
        (select cp.name, null, cp.Id_Category_Prototype
           from cf$.Category_Prototype cp
          where cp.Id_Category_Prototype = 210)
      returning Id_Category
           into vId_Category;
  end if;

  return vId_Category;
end;
$function$
