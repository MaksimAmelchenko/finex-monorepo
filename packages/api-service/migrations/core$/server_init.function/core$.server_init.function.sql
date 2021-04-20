CREATE OR REPLACE FUNCTION "core$".server_init(innode integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  -- Подготовка НОВОГО шарда
  -- Удаление ВСЕХ пользовательских данных и сброс последовательностей
  delete from core$.server;

  insert into core$.server (NNode)
       values (iNNode);

  execute 'truncate table cf$.cashflow cascade';
  -- NOTICE:  truncate cascades to table "cashflow_detail"

  execute 'truncate table cf$.account cascade';
  -- NOTICE:  truncate cascades to table "account_balance"
  -- NOTICE:  truncate cascades to table "account_permit"
  -- NOTICE:  truncate cascades to table "cashflow_detail"

  execute 'truncate table cf$.Tag';

  execute 'truncate table cf$.Contractor cascade';
  --NOTICE:  truncate cascades to table "cashflow"
  --NOTICE:  truncate cascades to table "cashflow_detail"

  execute 'truncate table cf$.unit';
  execute 'truncate table cf$.Category';

  execute 'truncate table cf$.Invitation';
  execute 'truncate table cf$.Money';
  execute 'truncate table cf$.Project_Permit';
  
  execute 'truncate table core$.File';
  execute 'truncate table core$.Operation_Log';
  execute 'truncate table core$.Password_Recovery_Request';
  execute 'truncate table core$.Session';
  execute 'truncate table core$.Signup_Request';

  execute 'truncate table msg$.Message cascade';
  -- NOTICE:  truncate cascades to table "message_attachment"


  delete from core$.user;
  delete from cf$.household;
  delete from cf$.Project;
  
  execute 'alter sequence core$.file_id_file_seq increment by 100 restart with ' || iNNode::text;
  execute 'alter sequence core$.operation_log_id_operation_log_seq increment by 100 restart with ' || iNNode::text;
  execute 'alter sequence core$.password_recovery_request_id_password_recovery_request_seq increment by 100 restart with ' || iNNode::text;
  execute 'alter sequence core$.session_id_session_seq increment by 100 restart with ' || iNNode::text;
  execute 'alter sequence core$.signup_request_id_signup_request_seq increment by 100 restart with ' || iNNode::text;
  execute 'alter sequence core$.user_id_user_seq increment by 100 restart with ' || iNNode::text;

  execute 'alter sequence cf$.account_id_account_seq increment by 100 restart with ' || iNNode::text;
  execute 'alter sequence cf$.cashflow_detail_id_cashflow_detail_seq increment by 100 restart with ' || iNNode::text;
  execute 'alter sequence cf$.cashflow_id_cashflow_seq increment by 100 restart with ' || iNNode::text;
  execute 'alter sequence cf$.category_id_category_seq increment by 100 restart with ' || iNNode::text;
  execute 'alter sequence cf$.contractor_id_contractor_seq increment by 100 restart with ' || iNNode::text;
  execute 'alter sequence cf$.household_id_household_seq increment by 100 restart with ' || iNNode::text;
  execute 'alter sequence cf$.invitation_id_invitation_seq increment by 100 restart with ' || iNNode::text;
  execute 'alter sequence cf$.money_id_money_seq increment by 100 restart with ' || iNNode::text;
  execute 'alter sequence cf$.project_id_project_seq increment by 100 restart with ' || iNNode::text;
  execute 'alter sequence cf$.tag_id_tag_seq increment by 100 restart with ' || iNNode::text;
  execute 'alter sequence cf$.unit_id_unit_seq increment by 100 restart with ' || iNNode::text;

  execute 'alter sequence msg$.message_id_message_seq increment by 100 restart with ' || iNNode::text;
end;
$function$
