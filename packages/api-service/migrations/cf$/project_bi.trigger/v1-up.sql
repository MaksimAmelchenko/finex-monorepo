CREATE TRIGGER project_bi BEFORE INSERT ON "cf$".project FOR EACH ROW EXECUTE FUNCTION "cf$".project_bi()
