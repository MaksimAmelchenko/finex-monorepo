CREATE OR REPLACE FUNCTION "cf$".plan_cashflow_item_bi()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  if new.Id_Project is null
  then
    new.Id_Project := context.get('Id_Project');
  end if;

  return new;
end;
$function$
