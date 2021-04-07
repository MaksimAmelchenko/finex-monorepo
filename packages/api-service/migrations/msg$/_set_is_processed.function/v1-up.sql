CREATE OR REPLACE FUNCTION "msg$"."#set_is_processed"(iid_message integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  update msg$.message m
     set Is_Processed = true,
         DEnd_Processing = clock_timestamp()
   where m.Id_Message = iId_Message;
end;
$function$
