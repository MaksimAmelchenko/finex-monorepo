CREATE OR REPLACE FUNCTION "cf$_import_source".get(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vResult             json;
  vId_Import_Source   cf$.v_Import_Source.Id_Import_Source%type;
begin
  begin
    vId_Import_Source := iParams->>'idImportSource';
  exception
    when others
    then
      perform error$.raise ('invalid_parameters');
  end;

  with ims as (select imsi.Id_Import_Source as "idImportSource",
                      imsi.Name,
                      imsi.Note,
                      (select json_agg(a) 
                         from  (select ist.code, 
                                       ist.name,
                                       ist.help,
                                       ist.note,
                                       ist.delimiter
                                  from cf$.v_Import_Source_Type ist 
                                 where ist.Id_Import_Source = imsi.Id_Import_Source
                                   and ist.Is_Enabled
                                 order by ist.Sorting, ist.Code) a) as "importSourceType"           
                 from cf$.v_Import_Source imsi
                where imsi.Id_Import_Source = coalesce (vId_Import_Source, imsi.Id_Import_Source)
                order by imsi.Name
              )
  select json_agg(ims)
    into vResult  
    from ims;

  if vId_Import_Source is null then
    oResult := concat ('"importSources"', ':', coalesce(vResult::text,'[]'));
  else
    oResult := concat ('"importSource"', ':', coalesce (vResult->>0, '{}'));
  end if;
end;
$function$
