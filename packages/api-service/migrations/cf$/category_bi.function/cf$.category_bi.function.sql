CREATE OR REPLACE FUNCTION "cf$".category_bi()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  if new.Id_User is null
  then
    new.Id_User := context.get('Id_User');
  end if;
  
  if new.Id_Project is null
  then
    new.Id_Project := context.get('Id_Project');
  end if;
  
  return new;
end;
$function$
