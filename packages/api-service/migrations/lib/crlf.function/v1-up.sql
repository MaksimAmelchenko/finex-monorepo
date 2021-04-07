CREATE OR REPLACE FUNCTION lib.crlf()
 RETURNS character varying
 LANGUAGE plpgsql
 IMMUTABLE SECURITY DEFINER
AS $function$
begin
  return chr (13) || chr (10);
end;
$function$
