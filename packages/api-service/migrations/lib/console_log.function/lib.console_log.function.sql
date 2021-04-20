CREATE OR REPLACE FUNCTION lib.console_log(imessage text, INOUT iotimestamptz timestamp with time zone)
 RETURNS timestamp with time zone
 LANGUAGE plpgsql
AS $function$
begin
--  raise notice '%',  concat( (epoch from (clock_timestamp() - ioTimestamptz )), ':', iMessage) ;
  raise notice '%', concat ( round( (extract (epoch from (clock_timestamp() - ioTimestamptz )))::numeric, 3), ': ', iMessage);
  ioTimestamptz  := clock_timestamp();
end;
$function$
