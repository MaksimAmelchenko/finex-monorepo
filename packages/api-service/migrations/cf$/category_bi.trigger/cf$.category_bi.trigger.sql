CREATE TRIGGER category_bi BEFORE INSERT ON "cf$".category FOR EACH ROW EXECUTE FUNCTION "cf$".category_bi()
