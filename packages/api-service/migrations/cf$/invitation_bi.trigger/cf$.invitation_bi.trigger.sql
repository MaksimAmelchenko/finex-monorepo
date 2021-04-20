CREATE TRIGGER invitation_bi BEFORE INSERT ON "cf$".invitation FOR EACH ROW EXECUTE FUNCTION "cf$".invitation_bi()
