CREATE TRIGGER session_bi BEFORE INSERT ON "core$".session FOR EACH ROW EXECUTE PROCEDURE "core$".session_tr_bi()