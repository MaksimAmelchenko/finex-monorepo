CREATE OR REPLACE FUNCTION "msg$".add_message(ifrom_name text, ifrom_address text, ito text, isubject text, itext_content text, ihtml_content text, ipriority smallint DEFAULT 3, OUT oid_message integer)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into msg$.Message (Id_User, 
                            From_Name, 
                            From_Address, 
                            "To", 
                            Subject, 
                            Text_Content,
                            HTML_Content,
                            Priority,
                            Is_Processed)
       values (context.get('Id_User')::int, 
               iFrom_Name, 
               iFrom_Address, 
               iTo, 
               iSubject, 
               iText_Content,
               iHTML_content,
               iPriority,
               false)
    returning Id_Message
         into oId_Message;
end;
$function$
