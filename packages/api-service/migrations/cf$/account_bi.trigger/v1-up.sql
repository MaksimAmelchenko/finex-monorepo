CREATE TRIGGER account_bi BEFORE INSERT ON "cf$".account FOR EACH ROW EXECUTE FUNCTION "cf$".account_bi()
