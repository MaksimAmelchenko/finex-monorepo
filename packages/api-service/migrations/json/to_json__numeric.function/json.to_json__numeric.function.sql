CREATE OR REPLACE FUNCTION json.to_json(ivalue numeric)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  return coalesce (to_json (iValue), 'null');
end;
$function$
