CREATE OR REPLACE FUNCTION "core$_port".set_request_info(iname character varying, ivalue character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
  perform set_config('request_ctx.' || iName, iValue, false);
end;
$function$
