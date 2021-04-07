CREATE OR REPLACE FUNCTION "cf$_project".permit()
 RETURNS TABLE(id_project integer, permit integer)
 LANGUAGE sql
 STABLE SECURITY DEFINER ROWS 10
AS $function$
with 
  ctx as (select context.get('Id_User')::int as Id_User)
  select p.Id_Project,
         7 as Permit
    from ctx, cf$.Project p
   where p.Id_User = ctx.Id_User
   union all
  select pp.Id_Project,
         pp.Permit
    from ctx, cf$.Project_Permit pp
   where pp.Id_User = ctx.Id_User
$function$
