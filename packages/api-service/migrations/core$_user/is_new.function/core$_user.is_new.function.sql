CREATE OR REPLACE FUNCTION "core$_user".is_new()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vId_User core$.User.Id_User%type := context.get('Id_User');
  vCount   int;
  vResult  boolean;
begin
  -- Является ли пользователь только-что зарегистрированным
  -- что бы показать ему приветсвенное сообщение

  -- Новичек: один проект, нет операций, доступных ему на чтение
  select count(*)
    into vCount
    from cf$.Project p
   where p.Id_User = vId_User;

  if vCount = 1
  then
    select count(*)
      into vCount
      from cf$.v_CashFlow_Detail cfd;
    if vCount > 0
    then
      vResult := false;
    else
      vResult := true;
    end if;
  else
    vResult := false;
  end if;
  
  return vResult;
end;
$function$
