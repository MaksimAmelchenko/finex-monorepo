CREATE OR REPLACE FUNCTION "cf$_tag".get(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vResult  json;
  vId_Tag  int;
begin

  begin
    vId_Tag := (iParams->>'idTag')::int;
  exception
    when others
    then
      perform error$.raise ('invalid_parameters');
  end;

  with t as (select ti.Id_Tag as "idTag",
                    ti.Id_User as "idUser",
                    ti.Name
               from cf$.v_Tag ti
              where ti.Id_Tag = coalesce (vId_Tag, ti.Id_Tag))
  select json_agg(t)
    into vResult
    from t;

  if vId_Tag is null then
    oResult := concat ('"tags"', ':', coalesce(vResult::text,'[]'));
  else
    oResult := concat ('"tag"', ':', coalesce (vResult->>0, '{}'));
  end if;

end;
$function$
