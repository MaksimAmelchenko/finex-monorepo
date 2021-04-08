CREATE OR REPLACE FUNCTION "core$_file".get(iparams json, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vId_File text;
  rF       record;
  vResult  text;
begin
 begin
    vId_File := iParams->>'idFile';
  exception
    when others
    then
      perform error.raise ('Invalid parameters');
  end;

  for rF in (select f.*
               from core$.v_File f 
                    join (select json_array_elements((case when substring(vId_File from 1 for 1) = '[' then vId_File else concat('[', vId_File, ']') end)::json)::text::int as Id_File) p using (Id_File))
  loop
      vResult := concat_ws(',', vResult,
                            json.object ( array ['name', json.to_json(rF.name),
                                                  'contentType', json.to_json (rF.content_Type),
                                                  'dirName', json.to_json (core$_file.dir_name()),
                                                  'innerName', json.to_json (rF.Inner_Name_Original_File)
                                                  ]));
  end loop;
  oResult := concat('[', vResult, ']');
end;
$function$
