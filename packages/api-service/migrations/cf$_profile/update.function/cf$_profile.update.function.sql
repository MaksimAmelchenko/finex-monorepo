CREATE OR REPLACE FUNCTION "cf$_profile".update(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vUser             core$.User%rowtype;
  vCurrencies       jsonb;
  vIsChangePassword boolean;
  vPassword         text;
  vNewPassword      text;
  vNewPasswordRetry text;
begin
  vUser.Id_User := context.get('Id_User')::int;
  vPassword := sanitize$.to_String (iParams->>'password');

  if vPassword is null then
    perform error$.raise ('invalid_parameters', iDev_Message := '"password" is required');
  end if;

  begin
    select u.*
      into strict vUser
      from core$.User u
     where u.Id_User = vUser.Id_User;
  exception
    when no_data_found then
      perform error$.raise ('no_data_found');
  end;
  
  if crypt(vPassword, vUser.password) != vUser.password then
    perform error$.raise ('authentication_failed', iMessage := 'Неверный пароль');
  end if;
   
  if iParams \? 'name' then
    vUser.Name := sanitize$.to_String (iParams->>'name');

    if vUser.Name is null then
      perform error$.raise ('invalid_parameters', iDev_Message := '"name" is empty');
    end if;
  end if;

  if iParams \? 'idProject' then
    begin
      vUser.Id_Project := (iParams->>'idProject')::int;
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idProject" must be a number');
    end;

    if vUser.Id_Project is null then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idProject" is empty');
    end if;
  end if;
  
  if iParams \? 'idCurrencyRateSource' then
    begin
      vUser.Id_Currency_Rate_Source := (iParams->>'idCurrencyRateSource')::int;
    exception
      when others then
        perform error$.raise ('invalid_parameters', iDev_Message := '"idCurrencyRateSource" must be a number');
    end;

    if vUser.Id_Currency_Rate_Source is null then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idCurrencyRateSource" is empty');
    end if;
  end if;

--  if iParams \? 'email' then
--    vUser.email = sanitize$.to_String (iParams->>'email');
--
--    if vUser.Id_Currency_Rate_Source is null then
--      perform error$.raise ('invalid_parameters', iDev_Message := '"email" is empty');
--    end if;
--  end if;

/*  if iParams \? 'tz' then
    vUser.tz = iParams->>'tz';
  end if;
*/
  begin
    vIsChangePassword := coalesce ((iParams->>'isChangePassword')::boolean, false);
  exception
    when others then
      perform error$.raise ('invalid_parameters', iDev_Message := '"isChangePassword" must be true or false');
  end;

/*  if vIsChangePassword then
    if (iParams \? 'newPassword') and (iParams \? 'newPasswordRetry') then
      vNewPassword := iParams->>'newPassword';
      vNewPasswordRetry := iParams->>'newPasswordRetry';
      if vNewPassword != vNewPasswordRetry then
        perform error$.raise ('invalid_parameters', iDev_Message := 'The passwords do not match');
      end if;

      if length (vNewPassword) < 5 then
        perform error$.raise ('invalid_parameters', iDev_Message := 'Password must contain at least 5 characters');
      end if;
      
      vUser.password := crypt(vNewPassword, gen_salt('bf', 8));
    else
      perform error$.raise ('invalid_parameters', iDev_Message := '"newPassword" and "newPasswordRetry" are required');
    end if;
  end if;
*/
  if vIsChangePassword then
    if (iParams \? 'newPassword') then
      vNewPassword := sanitize$.to_String (iParams->>'newPassword');

      if vNewPassword is null then
        perform error$.raise ('invalid_parameters', iDev_Message := 'A new password is empty');
      end if;

      if length (vNewPassword) < 5 then
        perform error$.raise ('invalid_parameters', iDev_Message := 'Password must contain at least 5 characters');
      end if;
      
      vUser.password := crypt(vNewPassword, gen_salt('bf', 8));
    else
      perform error$.raise ('invalid_parameters', iDev_Message := '"newPassword" is required');
    end if;
  end if;


  begin
    update core$.User u
       set name = vUser.name,
           --email = vUser.email,
           Id_Project = vUser.Id_Project,
           --tz = vUser.tz,
           password = vUser.password,
           Id_Currency_Rate_Source = vUser.Id_Currency_Rate_Source
     where u.Id_User = context.get('Id_User')::int;
  exception
    when unique_violation then
      declare
        vConstraint_Name text;
      begin    
        get stacked diagnostics vConstraint_Name = CONSTRAINT_NAME;
        perform error$.raise ('unique_violation.' || vConstraint_Name, idb_message := SQLERRM);
      end;
    when check_violation then
      declare
        vConstraint_Name text;
      begin    
        get stacked diagnostics vConstraint_Name = CONSTRAINT_NAME;
        perform error$.raise ('check_violation.' || vConstraint_Name, idb_message := SQLERRM);
      end;
  end;

  oResult := cf$_profile.get ('{}'::jsonb);
end;
$function$
