CREATE OR REPLACE FUNCTION "error$".format_fault(icode text, imessage text, idev_message text, idb_message text, imore_info text, istack text, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vError core$.v_Error%rowtype;
begin
  select e.*
    into vError
    from core$.v_Error e
   where e.Code = iCode;

--  oResult := concat('error', ':', json.object(array['code', json.to_json(iCode), 
  oResult := json.object(array['error', json.object(array['code', json.to_json(iCode), 
                                                    'status', json.to_json(coalesce(vError.status, 500)), 
                                                    'message', json.to_json(coalesce(nullif(iMessage, ''), vError.Message)) ,
                                                    'devMessage', json.to_json(coalesce(nullif(iDev_Message, ''), vError.Dev_Message)),
                                                    'dbMessage', json.to_json(iDB_Message),
                                                    'moreInfo', json.to_json(coalesce(nullif(iMore_Info, ''), vError.More_Info)),
                                                    'dbStack', json.to_json(iStack)
                                                   ])]);
end;
$function$
