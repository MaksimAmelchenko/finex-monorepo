CREATE OR REPLACE FUNCTION "core$_session".get(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vSession   core$.Session%rowtype;
  vSessionId core$.Session.Id%type := context.get('Id_Session')::uuid;
begin

  select s.*
    into vSession
    from core$.session s
   where s.id = vSessionId;

  oResult := concat('"session"', ':', json_build_object ('idProject', vSession.Id_Project
                                                         )::text);
end;
$function$
