CREATE OR REPLACE FUNCTION "cf$"."#account_permit_bi"()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
--  new.Id_User := context.get('Id_User')::int;
  if new.Id_Project is null then
    new.Id_Project := context.get('Id_Project')::int;
  end if;
  return new;
end;
$function$
