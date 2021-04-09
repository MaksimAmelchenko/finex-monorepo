CREATE OR REPLACE FUNCTION "core$_auth"."#create_account"(iparam json, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vUser          core$.user%rowtype;
  vError_Context varchar;
--  a integer;
begin
  begin
    vUser.Id_Household := iParam->>'idHousehold';
    vUser.name := iParam->>'name';
    vUser.email := iParam->>'email';
    vUser.password := iParam->>'password';
    vUser.tz := coalesce((iParam->>'tz')::varchar, '+4'::varchar);
  exception
  when others then
    perform error$.raise ('invalid_parameters');
  end;

  if   vUser.name is null
    or vUser.email is null
    or vUser.password is null
  then
    perform error$.raise ('invalid_parameters', iDev_Message := 'Name, email and password must be filled.');
  end if;

--  vUser.salt := core$.random_string(10);
 -- vUser.password := md5 (md5 (vUser.password) || vUser.salt);
  vUser.password := crypt(vUser.password, gen_salt('bf', 8));


  insert into core$.user (id_Household, name, email, password, tz)
       values (vUser.Id_Household, vUser.name, vUser.email, vUser.password, vUser.tz)
    returning Id_User
         into vUser.Id_User;

  oResult := json.object(array['idUser', json.to_json(vUser.Id_User)]);

end;
$function$
