CREATE OR REPLACE FUNCTION "core$_file"."#get"(iparams json, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vId_File integer;
  vFile    core$.v_File%rowtype;
begin
 begin
    vId_File := iParams->>'idFile';

    vFile.Name := iParams->>'fileName';
    vFile.Encoding := iParams->>'encoding';
    vFile.Content_Type := iParams->>'contentType';
    vFile.Inner_Name_Original_File := iParams->>'innerNameOriginalFile';
    vFile.Inner_Name_Processed_File := iParams->>'innerNameProcessedFile';
  exception
    when others
    then
      perform pError.raise ('Invalid parameters');
  end;

  begin
    select f.*
      into strict vFile
      from core$.v_File f
     where f.Id_File = vId_File;
  exception
    when no_data_found
    then
      perform pError.raise ('File not found');
      return;
  end;
  
  oResult := pJSON.object(array['name', pJSON.to_json(vFile.name),
--                                'encoding', pJSON.to_json(vFile.encoding),
                                'contentType', pJSON.to_json(vFile.content_Type),
                                'dirName', pJSON.to_json(core$_pFile.dir_name()),
                                'innerName', pJSON.to_json(vFile.Inner_Name_Original_File)
                                 ]);
end;
$function$
