CREATE OR REPLACE FUNCTION lib."#hstore_key"(ikey text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
begin
  return upper (regexp_replace (regexp_replace (trim(iKey), '\\', '\\\\', 'g'), '"', '\\"', 'g'));
end;
$function$
