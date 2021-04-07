CREATE OR REPLACE FUNCTION "core$_file"."#get_next_file"(iparams json, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vId_File integer;
begin
  vId_File := nextval(('core$.file_id_file_seq'::text)::regclass);
  oResult := json_build_object ('idFile', vId_File,
--                               'dirName', json.to_json(core$_file.dir_name()),
                                'innerName', core$_file.format_file_name (vId_File));
end;
$function$
