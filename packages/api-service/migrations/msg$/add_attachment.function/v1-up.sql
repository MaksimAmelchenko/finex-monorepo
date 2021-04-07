CREATE OR REPLACE FUNCTION "msg$".add_attachment(iid_message integer, iid_file integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into msg$.Message_Attachment (Id_Message, Id_File)
       values (iId_Message,  iId_File);
end;
$function$
