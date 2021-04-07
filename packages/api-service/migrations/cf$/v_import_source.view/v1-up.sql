CREATE OR REPLACE VIEW cf$."v_import_source" AS 
  SELECT import_source.id_import_source,
    import_source.name,
    import_source.note
   FROM "cf$".import_source;