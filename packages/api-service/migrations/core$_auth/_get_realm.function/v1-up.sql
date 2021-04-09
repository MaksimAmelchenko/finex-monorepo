CREATE OR REPLACE FUNCTION "core$_auth"."#get_realm"()
 RETURNS character varying
 LANGUAGE plpgsql
 IMMUTABLE SECURITY DEFINER
AS $function$
begin
  return 'AMIKSAM Server';
end;
$function$
