CREATE OR REPLACE FUNCTION json.to_json(ivalue boolean)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  return case when iValue then '1'  else '0' end;
end;
$function$
