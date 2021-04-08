CREATE OR REPLACE FUNCTION "core$_auth".hash_password(ipassword text)
 RETURNS text
 LANGUAGE plpgsql
 STRICT SECURITY DEFINER
AS $function$
begin
  return crypt(iPassword, gen_salt('bf', 8));
end;
$function$
