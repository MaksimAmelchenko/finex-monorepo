CREATE OR REPLACE FUNCTION "core$_user".get(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vResult  json;
  vId_User core$.user.Id_User%type;
begin
  begin
    vId_User := (iParams->>'idUser')::int;
  exception
    when others
    then
      perform error$.raise ('invalid_parameters');
  end;

  with u as (select u.Id_User as "idUser",
                    u.name,
                    u.email
              from core$.v_User u
             where u.Id_User = coalesce (vId_User, u.Id_User))
  select json_agg(u)
    into vResult
    from u;
  
  if vId_User is null then
    oResult := concat ('"users"', ':', coalesce(vResult::text, '[]'));
  else
    oResult := concat ('"user"', ':', coalesce (vResult->>0, '{}'));
  end if;

end;
$function$
