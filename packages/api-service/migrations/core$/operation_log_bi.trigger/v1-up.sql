CREATE TRIGGER operation_log_bi BEFORE INSERT ON "core$".operation_log FOR EACH ROW EXECUTE FUNCTION "core$".operation_log_tr_bi()
