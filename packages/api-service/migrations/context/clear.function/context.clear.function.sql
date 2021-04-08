CREATE OR REPLACE FUNCTION context.clear()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  perform context.set('Id_Session', null::text);
  perform context.set('Id_User', null::text);
  perform context.set('Id_Household', null::text);
  perform context.set('Id_Project', null::text);
  perform context.set('Id_Currency_Rate_Source', null::text);
--  perform context.set('isNotCheckPermit', null::text);
end;
$function$
