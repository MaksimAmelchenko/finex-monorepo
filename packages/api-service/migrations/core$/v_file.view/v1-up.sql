CREATE OR REPLACE VIEW core$."v_file" AS 
  SELECT f.id_file,
    f.name,
    f.dset,
    f.is_temporary,
    f.encoding,
    f.content_type,
    f.inner_name_original_file,
    f.inner_name_processed_file
   FROM "core$".file f
  WHERE (f.id_user = (context."#get"('Id_User'::text))::integer);