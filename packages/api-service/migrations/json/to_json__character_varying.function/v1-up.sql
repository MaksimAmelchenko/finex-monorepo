CREATE OR REPLACE FUNCTION json.to_json(ivalue character varying)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  return coalesce (to_json (iValue), '""');
end;
$function$
