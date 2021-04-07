CREATE OR REPLACE FUNCTION "core$".operation_log_tr_bi()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  if new.DSet is null 
  then 
    new.DSet := clock_timestamp();
  end if;

  if new.Id_User is null 
  then
    new.Id_User := context.get('Id_User');
  end if;

  return new;
end;
$function$
