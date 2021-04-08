CREATE OR REPLACE FUNCTION "core$_file".put(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vFile    core$.file%rowtype;
begin
 begin
    vFile.Name := iParams->>'fileName';
    vFile.Encoding := iParams->>'encoding';
    vFile.Content_Type := iParams->>'contentType';
  exception
    when others
    then
      perform error.raise ('Invalid parameters');
  end;

  insert into core$.File (name, Is_Temporary, encoding, Content_Type)
       values (vFile.Name, true, vFile.Encoding, vFile.Content_Type)
    returning Id_File, 
              Inner_Name_Original_File
         into vFile.Id_File,
              vFile.Inner_Name_Original_File;

  oResult := concat('"file"', ':', json_build_object ('idFile',  vFile.Id_File,
                                                      'innerName', vFile.Inner_Name_Original_File)::text);
end;
$function$
