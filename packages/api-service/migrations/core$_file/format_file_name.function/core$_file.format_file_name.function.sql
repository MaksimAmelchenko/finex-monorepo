CREATE OR REPLACE FUNCTION "core$_file".format_file_name(id_file integer, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
--  oResult := format ('%s-%s_%s', lpad (id_firm::text, , '0'), lpad (id_file::text, 8, '0'));
--  oResult := format ('%s:%s_%s', context.get('Id_Household'), context.get('Id_User'), id_file::text);
  oResult := format ('%s_%s', context.get('Id_User'), id_file::text);
end;
$function$
