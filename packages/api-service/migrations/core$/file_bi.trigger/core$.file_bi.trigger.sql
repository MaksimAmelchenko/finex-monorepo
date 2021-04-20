CREATE TRIGGER file_bi BEFORE INSERT ON "core$".file FOR EACH ROW EXECUTE FUNCTION "core$".file_tr_bi()
