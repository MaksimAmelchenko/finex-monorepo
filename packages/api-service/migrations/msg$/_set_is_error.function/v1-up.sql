CREATE OR REPLACE FUNCTION "msg$"."#set_is_error"(iid_message integer, imessage text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  update msg$.message1 m 
     set Is_Error = true,
         Is_Processed = true,
         DEnd_Processing = clock_timestamp(),
         Error_Message = iMessage
   where m.Id_Message = iId_Message;
end;
$function$
