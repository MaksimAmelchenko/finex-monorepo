CREATE TRIGGER contractor_bi BEFORE INSERT ON "cf$".contractor FOR EACH ROW EXECUTE FUNCTION "cf$".contractor_bi()
