CREATE OR REPLACE FUNCTION "cf$_profile".get(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vUser core$.User%rowtype;
begin
  vUser.Id_User := context.get('Id_User')::int;

  select u.*
    into vUser
    from core$.user u
   where u.Id_User = vUser.Id_User;

  oResult := concat('"profile"', ':', json_build_object ('idUser', vUser.Id_User,
                                                         'name', vUser.Name,
                                                         'email', vUser.email,
                                                         'idProject', vUser.Id_Project,
                                                         'idCurrencyRateSource', vUser.Id_Currency_Rate_Source
                                                         )::text);
end;
$function$
