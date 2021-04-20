CREATE TRIGGER plan_cashflow_item_bi BEFORE INSERT ON "cf$".plan_cashflow_item FOR EACH ROW EXECUTE FUNCTION "cf$".plan_cashflow_item_bi()
