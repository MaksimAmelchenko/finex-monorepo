CREATE OR REPLACE FUNCTION "cf$_tag".decode(itags text[], OUT otags integer[], OUT onew_tags text)
 RETURNS record
 LANGUAGE plpgsql
 STRICT SECURITY DEFINER
AS $function$
declare
  r        record;
  vTag     cf$.Tag%rowtype;
begin
  --  ["тег1", "Тег2", "Новый Тег3"] -> [1,2,4], {idTag: 4, name: 'Новый Тег3'}
  for r in (select trim(name) as Name
              from unnest(iTags) name)
  loop
      -- Проверяем, есть ли уже такой тег
    select t.Id_Tag
      into vTag.Id_Tag
      from cf$.v_Tag t
     where upper(t.name) = upper(r.name);
        
    if vTag.Id_Tag is null then
        insert into cf$.Tag (name)
             values (r.Name)
          returning *
               into vTag;

      oNew_Tags := concat_ws (',', oNew_Tags,
                            json_build_object('idTag', vTag.Id_Tag,
                                              'idUser', vTag.Id_User,
                                              'name', vTag.Name
                                              ));
    end if;   
    oTags := oTags || vTag.Id_Tag;
  end loop;
end;
$function$
