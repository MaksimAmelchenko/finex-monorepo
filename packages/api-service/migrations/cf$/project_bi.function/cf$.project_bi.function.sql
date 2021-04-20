CREATE OR REPLACE FUNCTION "cf$".project_bi()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  if new.Id_User is null then
    new.Id_User := context.get('Id_User')::int;
  end if;
 
 return new;
end;
$function$
