CREATE TRIGGER unit_bi BEFORE INSERT ON "cf$".unit FOR EACH ROW EXECUTE FUNCTION "cf$".unit_bi()
