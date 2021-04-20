CREATE TRIGGER plan_exclude_period_bi BEFORE INSERT ON "cf$".plan_exclude_period FOR EACH ROW EXECUTE FUNCTION "cf$".plan_exclude_period_bi()
