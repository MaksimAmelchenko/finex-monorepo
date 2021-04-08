CREATE OR REPLACE FUNCTION "core$_auth".password_recovery_confirm(iparam jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vPRR      core$.Password_Recovery_Request%rowtype;
  vPassword core$.user.password%type;
begin
  begin
    vPRR.token := sanitize$.to_String (iParam->>'token');
    vPassword := sanitize$.to_String (iParam->>'password');
  exception
    when others then
      perform error$.raise ('invalid_parameters');
  end;

  if vPRR.token is null
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"token" is required');
  end if;

  if vPassword is null
  then
    perform error$.raise ('invalid_parameters', iDev_Message := '"password" is required');
  end if;

  if length(vPassword) < 5 then
    perform error$.raise ('invalid_parameters', iDev_Message := '"password" must be at least 5 characters');
  end if;

  begin
    select prr.*
      into strict vPRR
      from core$.password_Recovery_Request prr
     where prr.token = vPRR.token
       and prr.DRecovery is null;
  exception
    when no_data_found then
      perform error$.raise ('no_data_found');
  end;
  
  update core$.password_Recovery_Request prr 
     set DRecovery = clock_timestamp()
   where prr.token = vPRR.token;

  update core$.user u
     set password  = core$_auth.hash_password(vPassword)
   where upper(u.email) = upper(vPRR.email);
    
  oResult := '';
end;
$function$
