CREATE OR REPLACE FUNCTION "core$_user".get_dlast_signin()
 RETURNS timestamp with time zone
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
declare
  vResult     core$.Session.last_access_time%type;
begin
  with ctx as (select context.get('Id_User')::int as Id_User,
                      context.get('Id_Session')::uuid as session_id)
  select max(s.last_access_time)
    into vResult
    from ctx, core$.session s
   where s.id_user = ctx.id_user
     and s.id != ctx.session_id;

  return vResult;     
end;
$function$
