CREATE OR REPLACE FUNCTION "cf$_contractor".get(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vResult        json;
  vId_Contractor cf$.Contractor.Id_Contractor%type;
begin
  begin
    vId_Contractor := iParams->>'idContractor';
  exception
    when others then
      perform error$.raise ('invalid_parameters');
  end;
  
  with c as (select ci.Id_User as "idUser",
                    ci.Id_Contractor as "idContractor",
                    ci.Name,
                    coalesce(ci.Note, '') as Note
               from cf$.v_Contractor ci
              where ci.Id_Contractor = coalesce(vId_Contractor, ci.Id_Contractor))
    select json_agg(c)
      into vResult
      from c;  
    
  if vId_Contractor is null then
    oResult := concat ('"contractors"', ':', coalesce(vResult::text,'[]'));
  else
    oResult := concat ('"contractor"', ':', coalesce (vResult->>0, '{}'));
  end if;
end;
$function$
