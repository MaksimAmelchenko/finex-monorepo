CREATE TRIGGER change_log_bi BEFORE INSERT ON "cf$".change_log FOR EACH ROW EXECUTE FUNCTION "cf$".change_log_bi()
