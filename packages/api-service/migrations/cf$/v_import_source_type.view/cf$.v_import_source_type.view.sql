CREATE OR REPLACE VIEW cf$."v_import_source_type" AS 
  SELECT ist.id_import_source,
    ist.code,
    ist.name,
    ist.is_enabled,
    ist.delimiter,
    ist.help,
    ist.note,
    ist.sorting
   FROM "cf$".import_source_type ist;
