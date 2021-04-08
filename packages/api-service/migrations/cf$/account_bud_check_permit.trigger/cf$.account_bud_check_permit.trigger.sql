CREATE TRIGGER account_bud_check_permit BEFORE DELETE OR UPDATE ON "cf$".account FOR EACH ROW EXECUTE FUNCTION "cf$".account_bud_check_permit()
