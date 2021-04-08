CREATE OR REPLACE FUNCTION "core$_file".save(iname text, icontent text, OUT oid_file integer)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vFile_Name text; 
  vloid      oid;
  vHandle    integer;
  vContent   bytea;
begin
  oId_File := nextval(('core$.file_id_file_seq'::text)::regclass);
  vFile_Name := core$_file.format_file_name (oId_File);

  vloid := lo_creat(-1);
  vHandle := lo_open (vloid, x'60000'::int);
  
  perform lowrite(vHandle, convert_to(iContent, 'win1251'));
  perform lo_close(vHandle);
  perform lo_export (vloid, core$_file.dir_name() || '/' || vFile_Name);
  perform lo_unlink (vloid);

  insert
    into core$.File (Id_File, name, Is_Temporary, encoding, Content_Type, Inner_Name_Original_File, Inner_Name_Processed_File)
  values (oId_File, iName, false, 'win1251', 'text/csv', vFile_Name, null);
  
end;
$function$
