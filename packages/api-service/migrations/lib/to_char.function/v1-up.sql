CREATE OR REPLACE FUNCTION lib.to_char(ivalue numeric)
 RETURNS text
 LANGUAGE plpgsql
 STABLE STRICT SECURITY DEFINER
AS $function$
begin
  return replace(to_char (iValue, 'FM999999990D00'), '.', ',');
end;
$function$
