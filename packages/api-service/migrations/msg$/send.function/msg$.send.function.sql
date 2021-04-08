CREATE OR REPLACE FUNCTION "msg$".send()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  notify Send_Message;
end;
$function$
