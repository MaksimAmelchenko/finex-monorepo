CREATE OR REPLACE FUNCTION "sanitize$".to_numeric(ivalue text)
 RETURNS numeric
 LANGUAGE sql
AS $function$
-- убираем "'", " ", 0x0A0 - неразрывный пробел
select nullif (regexp_replace (regexp_replace (iValue, '[\''\s\x0A0]', '', 'g'), ',', '.', 'g'), '')::numeric;
$function$
