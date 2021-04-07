CREATE OR REPLACE FUNCTION "msg$".message_bi()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  if new.DSet is null then
    new.DSet := clock_timestamp();
  end if;
  
  return new;
end;
$function$
