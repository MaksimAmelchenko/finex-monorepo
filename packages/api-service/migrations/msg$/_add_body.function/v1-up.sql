CREATE OR REPLACE FUNCTION "msg$"."#add_body"(iid_message integer, icontent text, icontent_type text DEFAULT 'text/plain; charset=utf-8'::text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into msg$.Message_Body (Id_Message, 
                                 Content_Type, 
                                 Content)
       values (iId_Message, 
               iContent_Type, 
               iContent);
end;
$function$
