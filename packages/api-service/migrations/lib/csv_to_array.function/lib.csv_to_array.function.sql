CREATE OR REPLACE FUNCTION lib.csv_to_array(itext text, idelimiter text DEFAULT ';'::text)
 RETURNS text[]
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  /*
  // http://www.bennadel.com/blog/1504-ask-ben-parsing-csv-strings-with-javascript-exec-regular-expression-command.htm
  // Delimiters.
  "(\\" + strDelimiter + "|\\r\?\\n|\\r|^)" +
  // Quoted fields.
  "(\?:\"([^\"]*(\?:\"\"[^\"]*)*)\"|" +
  // Standard fields.
  "([^\"\\" + strDelimiter + "\\r\\n]*))"
  */
  vReg text := '(\' || iDelimiter || '|\r\?\n|\r|^)(\?:\"([^\"]*(\?:\"\"[^\"]*)*)\"|' || '([^\"\' || iDelimiter || '\r\n]*))';
begin
  -- TODO убрать хак с iDelimiter || iText
  return (select array(select coalesce(a[2], a[3]) from regexp_matches(iDelimiter || iText, vReg, 'g') a));
end;
$function$
