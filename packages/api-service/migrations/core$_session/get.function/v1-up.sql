CREATE OR REPLACE FUNCTION "core$_session".get(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vSession    core$.Session%rowtype;
  vId_Session core$.Session.Id_Session%type := context.get('Id_Session')::int;
begin

  select s.*
    into vSession
    from core$.session s
   where s.Id_Session = vId_Session;

  oResult := concat('"session"', ':', json_build_object ('idProject', vSession.Id_Project
                                                         )::text);
end;
$function$
