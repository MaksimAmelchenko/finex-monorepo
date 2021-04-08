CREATE OR REPLACE FUNCTION "cf$_account".permit(iid_project integer DEFAULT (context.get('Id_Project'::text))::integer)
 RETURNS TABLE(id_project integer, id_account integer, permit integer)
 LANGUAGE sql
 STABLE SECURITY DEFINER ROWS 50
AS $function$
with 
  ctx as (select context.get('Id_User')::int as Id_User)
  select a.Id_Project,
         a.Id_Account, 
         7  as Permit
    from ctx, cf$.Account a
   where a.Id_Project = iId_Project
     and a.Id_User = ctx.Id_User
   union all
  select ap.Id_Project,
         ap.Id_Account,
         ap.Permit
    from ctx, cf$.Account_Permit ap
   where ap.Id_User = ctx.Id_User
     and ap.Id_Project = iId_Project
$function$
