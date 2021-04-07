CREATE OR REPLACE FUNCTION "cf$_project".get(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vId_Project      cf$.Project.Id_Project%type;
  vResult          json;
begin
  begin
    vId_Project := (iParams->>'idProject')::int;
  exception
    when others then
      perform error$.raise ('invalid_parameters');
  end;

  with t as (select p.Id_User as "idUser",
                    p.Id_Project as "idProject",
                    p.Name,
                    coalesce(p.Note, '') as Note,
                    p.Permit,
                    case 
                      when p.Permit = 7 then
                        array (select pp.Id_User
                                 from cf$.Project_Permit pp
                                where pp.Id_Project = p.Id_Project
                                  and pp.Permit = 3)
                      else
                        '{}'
                    end as "writers"
               from cf$.v_Project p
              where p.Id_Project = coalesce (vId_Project, p.Id_Project)
              order by p.Name)
  select json_agg(t)
    into vResult
    from t;

  if vId_Project is null then
    oResult := concat ('"projects"', ':', coalesce(vResult::text,'[]'));
  else
    oResult := concat ('"project"', ':', coalesce (vResult->>0, '{}'));
  end if;
end;
$function$
