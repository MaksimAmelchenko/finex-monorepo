CREATE OR REPLACE FUNCTION json.list(ivalues text[])
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vResult text;
  vLength integer;
begin
--  vResult := '';
  vLength := trunc (array_length (iValues, 1) / 2);
  for i in 1 .. vLength
  loop
    vResult := concat_ws(',', vResult, '"' || iValues [i * 2 - 1] || '"' || ':' || iValues [i * 2]);
  end loop;

-- return substring (vResult from 2;
 return vResult;
end;
$function$
