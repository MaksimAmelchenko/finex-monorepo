CREATE OR REPLACE FUNCTION json.format(ivalue date)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  return case when iValue is null
           then 'null'
           else to_char(iValue, 'yyyy-mm-dd')
         end;
end;
$function$
