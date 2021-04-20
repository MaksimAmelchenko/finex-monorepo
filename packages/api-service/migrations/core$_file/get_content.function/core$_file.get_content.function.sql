CREATE OR REPLACE FUNCTION "core$_file".get_content(iid_file integer, OUT ocontent text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vOid    oid;
  r       record;
  vFile   core$.v_File%rowtype;
  vResult bytea;
begin
  vResult := ''::bytea;

  select f.*
    into
  strict vFile
    from core$.v_File f
   where f.Id_File = iId_File;

  select lo_import(core$_file.dir_name() || '/' || coalesce(nullif(vFile.Inner_Name_Processed_File, ''), vFile.Inner_Name_Original_File))
    into vOid;


  for r in (select data
              from pg_largeobject
             where loid = vOid
             order by pageno)
  loop
    vResult = vResult || r.data;
  end loop;

  perform lo_unlink(vOid);

  oContent := convert_from(vResult, vFile.encoding);
exception
  when others then
    oContent := '';
    perform error$.raise ('error_loading_file');
/*    perform error.raise (concat('Error loading file "', vFile.Name, '"'));*/
end;
$function$
