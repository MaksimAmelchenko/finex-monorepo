CREATE OR REPLACE FUNCTION "core$".user_ad()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare
  vCount int;
begin
  select count(*)
    into vCount
    from core$.user u
   where u.Id_Household = old.Id_Household;
   
  if vCount = 0 then
    delete 
      from cf$.household h
     where h.Id_Household = old.Id_Household;
  end if;

  return null;
end;
$function$
