CREATE OR REPLACE FUNCTION "core$_cfg".get_session_timeout()
 RETURNS integer
 LANGUAGE plpgsql
 IMMUTABLE SECURITY DEFINER
AS $function$
begin
  -- Таймаут для сессии в секундах
--  return 20 * 60;
  return 20 * 60 * 100000;
end;
$function$
