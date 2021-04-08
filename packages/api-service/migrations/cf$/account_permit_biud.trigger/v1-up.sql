CREATE TRIGGER account_permit_biud BEFORE INSERT OR DELETE OR UPDATE ON "cf$".account_permit FOR EACH ROW EXECUTE FUNCTION "cf$".account_permit_biud_check_permit()
