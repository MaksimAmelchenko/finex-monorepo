CREATE OR REPLACE FUNCTION context.set(iname text, ivalue text, iis_local boolean DEFAULT true)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  -- true - Только для текущей транзакции
  perform set_config('core_ctx.' || iName, iValue, iIs_Local);
end;
$function$
