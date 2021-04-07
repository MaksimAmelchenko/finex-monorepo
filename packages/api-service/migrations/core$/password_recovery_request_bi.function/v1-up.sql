CREATE OR REPLACE FUNCTION "core$".password_recovery_request_bi()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.DSet := clock_timestamp();
  new.token := md5 (md5 (new.email) || core$.random_string(10)) || new.Id_Password_Recovery_Request::text;
  new.IP := core$_port.get_Request_Info('ip')::inet;
  return new;
end;
$function$
