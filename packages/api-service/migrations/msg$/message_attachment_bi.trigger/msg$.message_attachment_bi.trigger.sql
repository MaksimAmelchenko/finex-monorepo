CREATE TRIGGER message_attachment_bi BEFORE INSERT ON "msg$".message_attachment FOR EACH ROW EXECUTE FUNCTION "msg$".message_attachment_bi()
