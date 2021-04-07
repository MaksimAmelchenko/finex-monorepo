CREATE OR REPLACE FUNCTION "core$_user".get_dlast_signin()
 RETURNS timestamp with time zone
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
declare
  vResult     core$.Session.DSet%type;
begin
  with ctx as (select context.get('Id_User')::int as Id_User,
                      context.get('Id_Session')::bigint as Id_Session)
  select max(s.DSet)
    into vResult
    from ctx, core$.session s
   where s.Id_User = ctx.Id_User
     and s.Id_Session != ctx.Id_Session;

  return vResult;     
end;
$function$
