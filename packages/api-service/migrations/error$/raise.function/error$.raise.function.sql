CREATE OR REPLACE FUNCTION "error$".raise(icode text, imessage text DEFAULT NULL::text, idev_message text DEFAULT NULL::text, idb_message text DEFAULT NULL::text, imore_info text DEFAULT NULL::text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  a text[];
begin

--  raise exception '%', iId_Error;
--  raise exception '%', iDev_Message using detail = iCode;
  a = array ['code', json.to_json(iCode)];
  
  if iMessage is not null then
    a = a || array ['message', json.to_json(iMessage)];
  end if;

  if iDev_Message is not null then
    a = a || array ['devMessage', json.to_json(iDev_Message)];
  end if;

  if iDB_Message is not null then
    a = a || array ['dbMessage', json.to_json(iDB_Message)];
  end if;

  if iMore_Info is not null then
    a = a || array ['moreInfo', json.to_json(iMore_Info)];
  end if;
 
  raise exception using 
    errCode = 'CR999',
    message = json.object(a);
end;
$function$
