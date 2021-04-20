CREATE OR REPLACE FUNCTION "core$_auth".signup_confirm(iparam jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vSignUp_Request core$.SignUp_Request%rowtype;
  vId_Household   cf$.Household.Id_Household%type;
  vId_User        core$.User.Id_User%type;
  vId_Project     cf$.Project.Id_Project%type;
  a text;
begin
--      perform error$.raise ('no_data_found');    

  begin
    vSignUp_Request.token := sanitize$.to_String (iParam->>'token');
  exception
    when others then
      perform error$.raise ('invalid_parameters');
  end;

  if vSignUp_Request.token is null
  then
    perform error$.raise ('invalid_parameters', iDev_Message := 'token is required');
  end if;

  begin
    select sr.*
      into strict vSignUp_Request
      from core$.signup_request sr
     where sr.token = vSignUp_Request.token
       and sr.DConfirm is null;
  exception
    when no_data_found then
      perform error$.raise ('no_data_found');    
  end;
  
  update core$.signup_request sr 
     set DConfirm = clock_timestamp()
   where sr.token = vSignUp_Request.token;
    
  insert into cf$.household
       values (default)
    returning Id_Household
         into vId_Household;


  insert into core$.user (Id_Household, name, email, password, Id_Currency_Rate_Source)
       values (vId_Household, vSignUp_Request.name, vSignUp_Request.email, vSignUp_Request.password, 2)
    returning Id_User
         into vId_User;

  perform context.set('Id_User', vId_User::text);
  
  vId_Project := cf$_project.create('Моя бухгалтерия');
  
  update core$.User u
     set Id_Project = vId_Project         
   where u.Id_User = vId_User;

  oResult := '"idUser":' || json.to_json(vId_User);
end;
$function$
