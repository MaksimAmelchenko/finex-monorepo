CREATE OR REPLACE VIEW core$."v_error" AS 
  SELECT e.code,
    e.status,
    e.message,
    e.dev_message,
    e.more_info
   FROM "core$".error e;
