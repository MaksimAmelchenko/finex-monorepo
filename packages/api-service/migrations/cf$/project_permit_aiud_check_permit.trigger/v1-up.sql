CREATE TRIGGER project_permit_aiud_check_permit AFTER INSERT OR DELETE OR UPDATE ON "cf$".project_permit FOR EACH ROW EXECUTE FUNCTION "cf$".project_permit_aiud_check_permit()
