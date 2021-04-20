CREATE OR REPLACE FUNCTION "cf$".plan_cashflow_item_bd()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  delete 
    from cf$.Plan_Exclude pe
   where pe.Id_Project = old.Id_Project
     and pe.Id_Plan = old.Id_Plan;
     
  delete 
    from cf$.Plan_Exclude_Period pep
   where pep.Id_Project = old.Id_Project
     and pep.Id_Plan = old.Id_Plan;
     
  return old;
end;
$function$
