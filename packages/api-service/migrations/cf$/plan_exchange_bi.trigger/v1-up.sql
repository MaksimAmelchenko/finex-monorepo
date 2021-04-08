CREATE TRIGGER plan_exchange_bi BEFORE INSERT ON "cf$".plan_exchange FOR EACH ROW EXECUTE FUNCTION "cf$".plan_exchange_bi()
