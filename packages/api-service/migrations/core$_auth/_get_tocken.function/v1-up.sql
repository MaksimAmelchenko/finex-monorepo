CREATE OR REPLACE FUNCTION "core$_auth"."#get_tocken"(iid_session integer)
 RETURNS character varying
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
begin
  return md5 (concat(core$_port.get_Request_Info('ip'), iId_Session::text, ':ASDjIk23:Djd*Dfsd-dfs8sd'));
end;
$function$
