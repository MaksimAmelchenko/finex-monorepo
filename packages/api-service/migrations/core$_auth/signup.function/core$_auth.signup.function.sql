CREATE OR REPLACE FUNCTION "core$_auth".signup(iparam jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vSignUp_Request  core$.SignUp_Request%rowtype;
begin
  begin
    vSignUp_Request.name := sanitize$.to_String (iParam->>'name');
    vSignUp_Request.email := sanitize$.to_String (iParam->>'email');
    vSignUp_Request.password := sanitize$.to_String (iParam->>'password');
  exception
    when others then
      perform error$.raise ('invalid_parameters');
  end;

  if   vSignUp_Request.name is null
    or vSignUp_Request.email is null
    or vSignUp_Request.password is null
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"name", "email" and "password" are required');
  end if;
  
  if length(vSignUp_Request.password) < 5 then
    perform error$.raise ('invalid_parameters', iDev_Message := '"password" must be at least 5 characters');
  end if;

  vSignUp_Request.password := core$_auth.hash_password(vSignUp_Request.password);

  insert into core$.SignUp_Request (name, email, password, token)
       values (vSignUp_Request.name, vSignUp_Request.email, vSignUp_Request.password, vSignUp_Request.token)
    returning Token 
         into vSignUp_Request.Token;

  declare
    vText_Content text;
    vHtml_Content text;
    vData         jsonb;
  begin
    select oText_Content,
           oHTML_Content
      into vText_Content,
           vHTML_Content
      from msg$.get_Message_Content(1, json_build_object('name', vSignUp_Request.name, 
                                                         'url_signup_confirm', 'https://finex.io/signup/confirm\?token=' || vSignUp_Request.Token)::jsonb
                                   );

    perform msg$.add_Message(iFrom_Name := 'FINEX.io',
                             iFrom_Address := 'noreply@finex.io',
                             iTo := vSignUp_Request.email,
                             iSubject := 'Подтверждение регистрации',
                             iText_Content := vText_Content,
                             iHTML_Content := vHTML_Content
                             );
    perform msg$.Send(); 
  end;

  oResult := '"token":' || json.to_json(vSignUp_Request.token);
end;
$function$
