CREATE OR REPLACE FUNCTION "cf$_household".member()
 RETURNS TABLE(id_user integer)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER ROWS 10
AS $function$
begin
  /*
    Возвращает всех членов домохозяйства
  */
/*  return query (select u2.Id_User
                  from core$.user u
                       join cf$.household h on (h.Id_Household = u.Id_Household)
                       join core$.user u2 on (u2.Id_Household = h.Id_Household)
                 where u.Id_User = context.get('id_user')::int
               );
*/
  return query (select u.Id_User
                  from core$.user u
                 where u.Id_Household = context.get('Id_Household')::int
               );
end;
$function$
