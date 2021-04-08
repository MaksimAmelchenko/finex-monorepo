CREATE OR REPLACE FUNCTION json.format(ivalue timestamp with time zone)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
 return case when iValue is null
           then 'null'
           else to_char(iValue, 'yyyy-mm-dd hh24:mi:ss')
         end;
end;
$function$
