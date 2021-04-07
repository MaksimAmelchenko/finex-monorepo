CREATE OR REPLACE FUNCTION "core$_port".get_request_info(iname character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
declare
  vResult varchar;
begin
  begin
--    select current_setting('request_ctx.' || iName) into vResult;
    vResult := current_setting('request_ctx.' || iName);
  exception
    when others then
      vResult := null;
  end;

  return vResult;
end;
$function$
