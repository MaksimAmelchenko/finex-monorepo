CREATE OR REPLACE FUNCTION "core$_auth".authorize(itoken text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vId_Session   core$.Session.Id_Session%type;
  vIs_Expired   integer;
begin

  if iToken is null 
  then
	  perform error$.raise('authorization_failed');
  end if;
  
  begin
    select s.Id_Session,
           case when extract (epoch from (clock_timestamp() - s.last_access_time)) > core$_cfg.get_Session_Timeout() then 1 else 0 end Is_Expired
      into strict vId_Session,
                  vIs_Expired
      from core$.Session s
     where s.token = iToken;
--       and s.ip = core$_port.get_Request_Info('IP')::inet;
  exception
    when no_data_found 
    then
      perform error$.raise('authorization_failed');
  end;

  if vIs_Expired = 1
  then
    perform error$.raise('authorization_expired');
  end if;
      
  update core$.session s
     set last_access_time = clock_timestamp(),
         Requests_Count = s.Requests_Count + 1
   where s.Id_Session = vId_Session;

  perform context.set (vId_Session);
end;
$function$
