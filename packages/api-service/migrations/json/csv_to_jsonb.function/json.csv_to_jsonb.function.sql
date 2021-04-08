CREATE OR REPLACE FUNCTION json.csv_to_jsonb(icsv text, idelimiter character varying DEFAULT ';'::character varying)
 RETURNS SETOF jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  return query select ('["'
                       || unnest (string_to_array (regexp_replace (regexp_replace (regexp_replace (regexp_replace (regexp_replace (iCSV, chr(31), '', 'g'), 
                                                                                                                  E'\r\n|\n', E'\r', 'g'),
                                                                                                   '\\', '\\\\', 'g'),
                                                                                   '"', '\\"', 'g'),
                                                                   iDelimiter, '","', 'g'),
                                                   E'\r')
                                 )
                       || '"]')::jsonb;

/*
  return query select ('["' || regexp_replace(
                                regexp_split_to_table( regexp_replace( regexp_replace(iCSV, '\\', '\\\\', 'g'), '"', '', 'g'),  E'\r\n|\n|\r'),
                                iDelimiter, '","', 'g') || '"]')::json;
*/

--exception
--  when others then
--    perform error.raise('Invalid CSV file format');
end;
$function$
