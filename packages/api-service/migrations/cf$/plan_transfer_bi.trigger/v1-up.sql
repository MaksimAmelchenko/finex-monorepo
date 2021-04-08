CREATE TRIGGER plan_transfer_bi BEFORE INSERT ON "cf$".plan_transfer FOR EACH ROW EXECUTE FUNCTION "cf$".plan_transfer_bi()
