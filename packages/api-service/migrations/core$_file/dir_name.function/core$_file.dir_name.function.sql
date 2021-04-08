CREATE OR REPLACE FUNCTION "core$_file".dir_name(OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  oResult := '/mnt/nfs';
--  oResult := '/var/lib/postgresql/external/cf';
end;
$function$
