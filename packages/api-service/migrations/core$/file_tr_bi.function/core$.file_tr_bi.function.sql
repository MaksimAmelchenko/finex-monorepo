CREATE OR REPLACE FUNCTION "core$".file_tr_bi()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  if new.Id_User is null then
    new.Id_User := context.get('Id_User')::integer;
  end if;

  if new.DSet is null then
    new.DSet := clock_timestamp();
  end if;

  if new.inner_Name_Original_File is null then  
    new.inner_Name_Original_File := core$_file.format_file_name(new.Id_File);
  end if;

  return new;
end;
$function$
