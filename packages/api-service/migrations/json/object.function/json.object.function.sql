CREATE OR REPLACE FUNCTION json.object(ivalues text[])
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
 return  concat ('{', json.list (iValues), '}');
end;
$function$
