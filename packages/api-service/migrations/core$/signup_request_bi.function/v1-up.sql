CREATE OR REPLACE FUNCTION "core$".signup_request_bi()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.token := md5 (md5 (new.email) || core$.random_string(10)) || new.Id_Signup_Request::text;
  new.DSet := clock_timestamp();
  return new;
end;
$function$
