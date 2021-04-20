CREATE OR REPLACE FUNCTION lib.base64_encode(ivalue text)
 RETURNS text
 LANGUAGE plpgsql
 STABLE
AS $function$
begin
  return encode (convert_to(iValue, 'utf-8'), 'base64');
end;
$function$
