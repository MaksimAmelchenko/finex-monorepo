CREATE OR REPLACE FUNCTION lib."#to_numeric"(ivalue text)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
declare
  vResult numeric;
begin
  -- 0xA0 - неразрывный пробел
  begin
    vResult := nullif(regexp_replace (regexp_replace (regexp_replace (regexp_replace (iValue, '''', '', 'g'), chr (x'A0'::int), '', 'g'), ' ', '', 'g'), ',', '.', 'g'), '');
  exception
    when others then
      vResult := null;
  end;

  return vResult;
end;
$function$
