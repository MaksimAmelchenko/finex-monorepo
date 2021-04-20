CREATE OR REPLACE FUNCTION "cf$_account".get(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vResult          json;
  vId_Account      cf$.Account.Id_Account%type;
begin

  begin
    vId_Account := (iParams->>'idAccount')::int;
  exception
    when others
    then
      perform error$.raise ('invalid_parameters');
  end;

  with t as (select a.Id_User as "idUser",
                    a.Id_Account as "idAccount",
                    a.Id_Account_Type as "idAccountType",
                    a.Name,
                    coalesce (a.Note, '') as note,
                    a.Permit,
                    a.Is_Enabled as "isEnabled",
                    case 
                      when a.Permit = 7 then
                        array (select ap.Id_User
                                 from cf$.v_Account_Permit ap
                                where ap.Id_Account = a.Id_Account 
                                  and ap.Permit = 1)
                      else
                        '{}'
                    end as "readers",
                    case 
                      when a.Permit = 7 then
                        array (select ap.Id_User
                                 from cf$.v_Account_Permit ap
                                where ap.Id_Account = a.Id_Account 
                                  and ap.Permit = 3)
                      else
                        '{}'
                    end as "writers"
               from cf$.v_account a
              where a.Id_Account = coalesce(vId_Account, a.Id_Account))
  select json_agg(t)
    into vResult
    from t;

  if vId_Account is null then
    oResult := concat ('"accounts"', ':', coalesce(vResult::text,'[]'));
  else
    oResult := concat ('"account"', ':', coalesce (vResult->>0, '{}'));
  end if;
end;
$function$
