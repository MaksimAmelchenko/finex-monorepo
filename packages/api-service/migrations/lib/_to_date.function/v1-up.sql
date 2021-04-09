CREATE OR REPLACE FUNCTION lib."#to_date"(ivalue text, iformat text DEFAULT 'YYYY-MM-DD'::text)
 RETURNS date
 LANGUAGE plpgsql
AS $function$
declare
  vResult date;
begin
  if nullif (iValue, '') is null then
    vResult := null;
  else
    vResult := to_date(nullif(trim(ivalue), ''), 'dd.mm.yyyy');
  end if;

  return vResult;
end;
$function$
