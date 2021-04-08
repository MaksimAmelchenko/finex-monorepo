CREATE TRIGGER plan_exclude_bi BEFORE INSERT ON "cf$".plan_exclude FOR EACH ROW EXECUTE FUNCTION "cf$".plan_exclude_bi()
