CREATE OR REPLACE FUNCTION "msg$".get_message_content(iid_message_template integer, idata jsonb, OUT otext_content text, OUT ohtml_content text)
 RETURNS record
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  r record;
begin
  select text_template,
         html_template
    into strict 
         oText_Content,
         oHtml_Content
    from msg$.message_template mt
   where mt.Id_Message_Template = iId_Message_Template;
   
  for r in (select '{{' || key || '}}' as tag,
                   value
              from jsonb_each_text(iData)) loop
    oText_Content := replace (oText_Content, r.tag, r.value);
    oHTML_Content := replace (oHTML_Content, r.tag, r.value);
  end loop;   
end;
$function$
