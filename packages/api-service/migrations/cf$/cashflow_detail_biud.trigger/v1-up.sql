CREATE TRIGGER cashflow_detail_biud BEFORE INSERT OR DELETE OR UPDATE ON "cf$".cashflow_detail FOR EACH ROW EXECUTE FUNCTION "cf$".cashflow_detail_biud()
