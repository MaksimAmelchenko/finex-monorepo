CREATE TRIGGER message_bi BEFORE INSERT ON "msg$".message FOR EACH ROW EXECUTE FUNCTION "msg$".message_bi()
