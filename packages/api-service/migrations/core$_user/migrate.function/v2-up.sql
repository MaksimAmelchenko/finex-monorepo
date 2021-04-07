CREATE OR REPLACE FUNCTION "core$_user".migrate(iparams jsonb, OUT oresult text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  vId_User  core$.user.Id_User%type;
  vConString text;
begin
  begin
    vId_User := (iParams->>'idUser')::int;
  exception
    when others then
      perform error$.raise ('invalid_parameters', iDev_Message := '"idUser" must be a number');
  end;

  if vId_User is null then
    perform error$.raise ('invalid_parameters', iDev_Message := '"idUser" is required');
  end if;
  
  if (iParams \? 'conString') then
    vConString := sanitize$.to_String (iParams->>'conString');
  end if;

  if vConString is null then
    perform error$.raise ('invalid_parameters', iDev_Message := '"conString" is required');
  end if;
  
  -- !password!
  -- Формируем новую строку соединения с БД
  vConString :=  'postgres://migration:eGjQBVI7qSBpuPBabtSW' || substring(vConString from '@.*');

  perform dblink_connect_u (vConString);

  --set constraints core$.user_2_project deferred;
  
  perform context.set ('isNotCheckPermit', '1'); 
  begin
    -- Household
    insert 
      into cf$.household (id_household)
    select id_household
      from dblink('select h.id_household from core$.user u join cf$.household h on (h.Id_Household = u.Id_Household) where u.Id_User = ' || vId_User::text) 
        as h(id_household int);

    -- User
    insert 
      into core$.user (id_user, name, email, password, tz, id_household, id_project, id_currency_rate_source)
    select id_user, name, email, password, tz, id_household, id_project, id_currency_rate_source
      from dblink('select id_user, name, email, password, tz, id_household, id_project, id_currency_rate_source from core$.user where Id_User = ' || vId_User::text) 
        as u(id_user int, name text, email text, password text, tz text, id_household int, id_project int, id_currency_rate_source smallint);
   
    -- Project
    insert 
      into cf$.project (id_user, id_project, name, note)
    select id_user, id_project, name, note
      from dblink('select id_user, id_project, name, note from cf$.project where Id_User = ' || vId_User::text) 
        as p(id_user int, id_project int, name text, note text);
        
    -- File
    insert 
      into core$.file (id_user, id_file, name, dset, is_temporary, encoding, content_type, inner_name_original_file, inner_name_processed_file )
    select id_user, id_file, name, dset, is_temporary, encoding, content_type, inner_name_original_file, inner_name_processed_file 
      from dblink('select id_user, id_file, name, dset, is_temporary, encoding, content_type, inner_name_original_file, inner_name_processed_file from core$.file where Id_User = ' || vId_User::text) 
        as f(id_user int, id_file int, name text, dset timestamptz(0), is_temporary boolean, encoding text, content_type text, inner_name_original_file text, inner_name_processed_file text);

    -- Operation_Log (для статистики)
    insert 
      into core$.Operation_Log (id_operation_log, id_operation, id_user, is_error, time_spent_ms, params, result, dset)
    select id_operation_log, id_operation, id_user, is_error, time_spent_ms, params, result, dset
      from dblink('select id_operation_log, id_operation, id_user, is_error, time_spent_ms, params, result, dset from core$.Operation_Log where Id_User = ' || vId_User::text) 
        as ol(id_operation_log bigint, id_operation int, id_user int, is_error int, time_spent_ms numeric, params text, result text, dset timestamptz(0));

    -- Session (для статистики)
    insert 
      into core$.session (id, user_agent, created_at, updated_at, id_user, last_access_time, ip, requests_count, id_project)
    select id, user_agent, created_at, updated_at, id_user, last_access_time, ip, requests_count, id_project
      from dblink('select id, user_agent, created_at, updated_at, id_user, last_access_time, ip, requests_count, id_project from core$.Session where Id_User = ' || vId_User::text)
        as ol(id_session bigint, token text, id_user int, last_access_time timestamptz(0), ip inet, requests_count int, id_project int);

    -- Message
    insert 
      into msg$.Message (id_message, id_user, from_name, from_address, "To", cc, subject, text_content, html_content, priority, is_processed, is_error, dset, dbegin_processing, dend_processing, message_id, error_message)
    select id_message, id_user, from_name, from_address, "To", cc, subject, text_content, html_content, priority, is_processed, is_error, dset, dbegin_processing, dend_processing, message_id, error_message
      from dblink('select id_message, id_user, from_name, from_address, "To", cc, subject, text_content, html_content, priority, is_processed, is_error, dset, dbegin_processing, dend_processing, message_id, error_message from msg$.Message where Id_User = ' || vId_User::text) 
        as m(id_message int, id_user int, from_name text, from_address text, "To" text, cc text, subject text, text_content text, html_content text, priority smallint, is_processed boolean, is_error boolean, dset timestamptz, dbegin_processing timestamptz, dend_processing timestamptz, message_id text, error_message text);

    -- Message_Attachment
    insert 
      into msg$.Message (id_message, id_file)
    select id_message, id_File
      from dblink('select ma.id_message, ma.id_File msg$.Message_Attachment ma join msg$.Message m on (m.Id_Message = ma.Id_Message) where m.Id_User = ' || vId_User::text) 
        as ma(id_message int, id_File int);

    -- Account      
    insert 
      into cf$.account (id_account, id_project, id_user, name, is_enabled, note, id_account_type)
    select id_account, id_project, id_user, name, is_enabled, note, id_account_type 
      from dblink('select id_account, id_project, id_user, name, is_enabled, note, id_account_type from cf$.account where Id_User = ' || vId_User::text) 
        as a(id_account int, id_project int, id_user int, name text, is_enabled boolean, note text, id_account_type smallint);

    -- Contractor
    insert 
      into cf$.Contractor (id_contractor, id_project, id_user, name, note)
    select id_contractor, id_project, id_user, name, note
      from dblink('select id_contractor, id_project, id_user, name, note from cf$.contractor where Id_User = ' || vId_User::text) 
        as c(id_contractor int, id_project int, id_user int, name text, note text);

    -- Unit
    insert 
      into cf$.Unit (id_user, id_unit, name, id_project)
    select id_user, id_unit, name, id_project
      from dblink('select id_user, id_unit, name, id_project from cf$.unit where Id_User = ' || vId_User::text) 
        as u(id_user int, id_unit int, name text, id_project int);

    -- Tag
    insert 
      into cf$.Tag (id_tag, id_project, id_user, name)
    select id_tag, id_project, id_user, name
      from dblink('select id_tag, id_project, id_user, name from cf$.Tag where Id_User = ' || vId_User::text) 
        as t(id_tag int, id_project int, id_user int, name text);

    -- Money
    insert 
      into cf$.Money (Id_Project, Id_Money, Id_User, Id_Currency, name, Is_Enabled, Sorting)
    select Id_Project, Id_Money, Id_User, Id_Currency, name, Is_Enabled, Sorting
      from dblink('select Id_Project, Id_Money, Id_User, Id_Currency, name, Is_Enabled, Sorting from cf$.Money where Id_User = ' || vId_User::text) 
        as t(Id_Project int, Id_Money int, Id_User int, Id_Currency int, name text, Is_Enabled boolean, Sorting smallint);

    -- Invitation
    insert 
      into cf$.Invitation (id_invitation, id_user_host, id_user_guest, email_host, message, dset)
    select id_invitation, id_user_host, id_user_guest, email_host, message, dset
      from dblink('select id_invitation, id_user_host, id_user_guest, email_host, message, dset from cf$.Invitation where Id_User_Guest = ' || vId_User::text) 
        as i(id_invitation int, id_user_host int, id_user_guest int, email_host text, message text, dset timestamptz(0));

    -- Category
    insert 
      into cf$.Category (id_category, id_project, id_user, parent, id_unit, name, note, is_enabled, id_category_prototype, is_system)
    select id_Category, id_project, id_user, parent, id_unit, name, note, is_enabled, id_category_prototype, is_system
      from dblink('select Id_Category, id_project, id_user, parent, id_unit, name, note, is_enabled, id_category_prototype, is_system from cf$.Category where Id_User = ' || vId_User::text) 
        as cfi(Id_Category int, id_project int, id_user int, parent int, id_unit int, name text, note text, is_enabled boolean, id_category_prototype int, is_system boolean);

    -- CashFlow
    insert 
      into cf$.CashFlow (id_cashflow, id_project, id_user, id_contractor, id_cashflow_type, note, dset, tags)
    select id_cashflow, id_project, id_user, id_contractor, id_cashflow_type, note, dset, tags
      from dblink('select id_cashflow, id_project, id_user, id_contractor, id_cashflow_type, note, dset, tags from cf$.CashFlow where Id_User = ' || vId_User::text) 
        as cf(id_cashflow bigint, id_project int, id_user int, id_contractor int, id_cashflow_type int, note text, dset timestamptz(0), tags integer[]);

    -- CashFlow_Detail
    insert 
      into cf$.CashFlow_Detail (id_cashflow_detail, id_project, id_user, id_cashflow, id_account, id_Category, id_Money, id_unit, sign, dcashflow_detail, report_period, quantity, sum, note, tags, is_not_confirmed)
    select id_cashflow_detail, id_project, id_user, id_cashflow, id_account, id_Category, id_Money, id_unit, sign, dcashflow_detail, report_period, quantity, sum, note, tags, is_not_confirmed 
      from dblink('select id_cashflow_detail, id_project, id_user, id_cashflow, id_account, id_Category, id_Money, id_unit, sign, dcashflow_detail, report_period, quantity, sum, note, tags, is_not_confirmed  from cf$.CashFlow_Detail where Id_User = ' || vId_User::text) 
        as cfd(id_cashflow_detail bigint, id_project int, id_user int, id_cashflow bigint, id_account int, id_Category int, id_Money int, id_unit int, sign smallint, dcashflow_detail date, report_period date, quantity numeric, sum numeric, note text, tags integer[], is_not_confirmed boolean);

    perform dblink_exec('update core$.User set Id_User_Status = 3 where Id_User = ' || vId_User::text);

    perform dblink_disconnect ();
    perform context.set ('isNotCheckPermit', ''); 
  exception
    when others then
      perform context.set ('isNotCheckPermit', ''); 
      raise;
  end;
  oResult := '';
end;
$function$
