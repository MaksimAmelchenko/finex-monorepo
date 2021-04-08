CREATE OR REPLACE FUNCTION "cf$_account_type".get(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vResult  json;
begin
  with u as (select t.Id_Account_Type as "idAccountType",
                    t.Name,
                    t.Short_Name as "shortName"
               from cf$.Account_Type t)
  select json_agg(u)
    into vResult
    from u;

  oResult := concat ('"accountTypes"', ':', coalesce(vResult::text, '[]'));
end;
$function$
