CREATE OR REPLACE FUNCTION context.set(isession_id uuid, iis_local boolean DEFAULT true)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vId_User                 core$.User.Id_User%type;
  vId_Household            core$.User.Id_Household%type;
  --vTZ                    core$.User.tz%type;
  vId_Currency_Rate_Source core$.User.Id_Currency_Rate_Source%type;
  vId_Project              core$.Session.Id_Project%type;
begin
  -- TODO Сделать контекст через временную таблицу, что нельзя было менять контекс всем-подряд

  perform context.clear();

  if iSession_Id is not null
    then
      begin
        select u.Id_User,
               u.Id_Household,
               s.Id_Project,
               --u.tz,
               u.Id_Currency_Rate_Source
          into strict
               vId_User,
               vId_Household,
               vId_Project,
               --vTZ,
               vId_Currency_Rate_Source
          from      core$.Session s
               join core$.User u using (Id_User)
         where s.id = iSession_Id;
        

/*        execute 'set local timeZone = ' || quote_literal(vTZ);*/
        perform context.set('Id_Session', iSession_Id::text, iIs_Local);
        perform context.set('Id_User', vId_User::text, iIs_Local);
        perform context.set('Id_Household', vId_Household::text, iIs_Local);
        perform context.set('Id_Project', vId_Project::text, iIs_Local);
        perform context.set('Id_Currency_Rate_Source', vId_Currency_Rate_Source::text, iIs_Local);

--      exception
--        when others
--        then
--          perform error$.raise ('set_context_failed');
      end;
    end if;
end;
$function$
