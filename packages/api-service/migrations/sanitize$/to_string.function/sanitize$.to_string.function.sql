CREATE OR REPLACE FUNCTION "sanitize$".to_string(ivalue text)
 RETURNS text
 LANGUAGE sql
AS $function$
select nullif (trim (iValue), '');
$function$
