CREATE OR REPLACE FUNCTION "core$_auth".password_recovery(iparam jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vId_User core$.User.Id_User%type;
  vname    core$.User.Name%type;
  
  vPRR     core$.Password_Recovery_Request%rowtype;
begin
  begin
    vPRR.EMail := sanitize$.to_String (iParam->>'email');
  exception
    when others then
      perform error$.raise ('invalid_parameters');
  end;

  if vPRR.email is null
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"email" is required');
  end if;

  begin
    select u.Id_User,
           u.name
      into strict vId_User,
                  vName
      from core$.user u
     where upper(u.email) = upper(vPRR.EMail);
  exception
    when no_data_found then
      perform error$.raise ('no_data_found', iMessage := 'Указанного Вами логина не существует');
  end;     

  insert into core$.Password_Recovery_Request (email)
       values (vPRR.EMail)
    returning Token
         into vPRR.Token;


  declare
    vText_Content text;
    vHtml_Content text;
    vData         jsonb;
  begin
    select oText_Content,
           oHTML_Content
      into vText_Content,
           vHTML_Content
      from msg$.get_Message_Content(2, json_build_object('name', vName, 
                                                         'url_signup_confirm', 'https://finex.io/password_recovery/confirm\?token=' || vPRR.Token)::jsonb
                                   );

    perform msg$.add_Message(iFrom_Name := 'FINEX.io',
                             iFrom_Address := 'noreply@finex.io',
                             iTo := vPRR.EMail,
                             iSubject := 'Восстановление пароля',
                             iText_Content := vText_Content,
                             iHTML_Content := vHTML_Content
                             );
    perform msg$.Send(); 
  end;

  oResult := '"token":' || json.to_json(vPRR.token);

end;
$function$
