CREATE OR REPLACE FUNCTION "sanitize$".to_date(ivalue text, iformat text DEFAULT 'yyyy-mm-dd'::text)
 RETURNS date
 LANGUAGE sql
AS $function$
select to_date (nullif (trim (iValue), ''), iFormat);
$function$
