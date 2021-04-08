CREATE OR REPLACE FUNCTION lib.csv_to_arrays(itext text, idelimiter text DEFAULT ';'::text)
 RETURNS SETOF text[]
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  return query (select lib.csv_to_array (unnest (string_to_array (regexp_replace (regexp_replace (iText, chr(31), '', 'g'), 
                                                                   E'\r\n|\n', E'\r', 'g'),
                                                E'\r')
                                               ),
                                         iDelimiter)
               );
end;
$function$
