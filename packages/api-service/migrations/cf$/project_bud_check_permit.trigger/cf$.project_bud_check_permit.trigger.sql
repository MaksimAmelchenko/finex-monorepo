CREATE TRIGGER project_bud_check_permit BEFORE DELETE OR UPDATE ON "cf$".project FOR EACH ROW EXECUTE FUNCTION "cf$".project_bud_check_permit()
