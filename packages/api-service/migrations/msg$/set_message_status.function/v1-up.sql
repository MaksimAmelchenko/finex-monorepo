CREATE OR REPLACE FUNCTION "msg$".set_message_status(iid_message integer, ierror_message text, imessage_id text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vError_Message msg$.Message.Error_Message%type;
  vMessage_Id    msg$.Message.Message_Id%type;
begin
  vError_Message := nullif(trim(iError_Message), '');
  vMessage_Id := nullif(trim(iMessage_Id), '');

  update msg$.message m 
     set Is_Processed = true,
         Is_Error = vError_Message is not null,
         DEnd_Processing = clock_timestamp(),
         Message_Id = vMessage_Id,
         Error_Message = vError_Message
   where m.Id_Message = iId_Message;
end;
$function$
