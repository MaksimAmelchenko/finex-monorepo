CREATE OR REPLACE FUNCTION "msg$".get_next_message(OUT id_message integer, OUT message text)
 RETURNS record
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  r    record;
  vOid integer := 'msg$.message'::regclass::oid::integer;
begin
  Id_Message := null;
  Message := '{}';
  for r in (select m.Id_Message,
                   m.From_Name,
                   m.From_Address,
                   m."To",
                   m.cc,
                   m.Subject,
                   m.Text_Content,
                   m.HTML_Content
              from msg$.message m
             where not m.Is_Processed 
             order by m.Priority, Id_Message)
  loop
    if pg_try_advisory_xact_lock (vOid, r.Id_Message) then
      Id_Message := r.Id_Message;
      Message := json_build_object('from', json_build_object ('name', r.From_Name,
                                                              'address', r.From_Address),
                                    'to', r."To",
                                    'cc', r.cc,
                                    'subject', r.Subject,
                                    'text', r.Text_Content,
                                    'html', r.HTML_Content
                                    );
      -- Перестрахуемся и поставим, что сообщение отправлено сразу
      -- Иначе возможны варианты, когда заспамим пользователей (например письмо отправится, а информация по отправки в БД не попадет
      update msg$.Message m
         set Is_Processed = true,
             DBegin_Processing = clock_timestamp()
       where m.Id_Message = r.Id_Message;
      exit;
    end if;    
  end loop;
end;
$function$
