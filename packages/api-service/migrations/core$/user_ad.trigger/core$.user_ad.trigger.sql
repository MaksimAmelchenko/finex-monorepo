CREATE TRIGGER user_ad AFTER DELETE ON "core$"."user" FOR EACH ROW EXECUTE FUNCTION "core$".user_ad()
