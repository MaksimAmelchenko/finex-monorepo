CREATE TRIGGER cashflow_bi BEFORE INSERT ON "cf$".cashflow FOR EACH ROW EXECUTE FUNCTION "cf$".cashflow_bi()
