CREATE OR REPLACE FUNCTION "core$".random_string(ilength integer)
 RETURNS text
 LANGUAGE sql
AS $function$
--select
--  array_to_string (array (select substring('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' from (random() * 62) ::integer for 1) from generate_series(1, iLength)), '')
select string_agg (o.ch, '')
  from (select substring('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' from (random() * 62) ::integer for 1) as ch
          from generate_series(1, iLength)
       ) o
$function$
