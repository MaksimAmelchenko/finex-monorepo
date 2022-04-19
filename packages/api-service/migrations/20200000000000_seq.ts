import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return;
  await knex.schema.raw(
    "select setval('cf$.account_id_account_seq', (select coalesce(MAX(id_account)+1,1) from cf$.account))"
  );
  await knex.schema.raw(
    "select setval('cf$.cashflow_detail_id_cashflow_detail_seq', (select coalesce(MAX(id_cashflow_detail)+1,1) from cf$.cashflow_detail))"
  );
  await knex.schema.raw(
    "select setval('cf$.cashflow_id_cashflow_seq', (select coalesce(MAX(id_cashflow)+1,1) from cf$.cashflow))"
  );
  await knex.schema.raw(
    "select setval('cf$.change_log_id_change_log_seq', (select coalesce(MAX(id_change_log)+1,1) from cf$.change_log))"
  );
  await knex.schema.raw(
    "select setval('cf$.contractor_id_contractor_seq', (select coalesce(MAX(id_contractor)+1,1) from cf$.contractor))"
  );
  await knex.schema.raw(
    "select setval('cf$.household_id_household_seq', (select coalesce(MAX(id_household)+1,1) from cf$.household))"
  );
  await knex.schema.raw(
    "select setval('cf$.invitation_id_invitation_seq', (select coalesce(MAX(id_invitation)+1,1) from cf$.invitation))"
  );
  await knex.schema.raw("select setval('cf$.money_id_money_seq', (select coalesce(MAX(id_money)+1,1) from cf$.money))");
  await knex.schema.raw(
    "select setval('cf$.money_rate_id_money_rate_seq', (select coalesce(MAX(id_money_rate)+1,1) from cf$.money_rate))"
  );
  await knex.schema.raw("select setval('cf$.plan_id_plan_seq', (select coalesce(MAX(id_plan)+1,1) from cf$.plan))");
  await knex.schema.raw(
    "select setval('cf$.project_id_project_seq', (select coalesce(MAX(id_project)+1,1) from cf$.project))"
  );
  await knex.schema.raw("select setval('cf$.tag_id_tag_seq', (select coalesce(MAX(id_tag)+1,1) from cf$.tag))");
  await knex.schema.raw("select setval('cf$.unit_id_unit_seq', (select coalesce(MAX(id_unit)+1,1) from cf$.unit))");

  await knex.schema.raw("select setval('core$.file_id_file_seq', (select coalesce(MAX(id_file)+1,1) from core$.file))");
  await knex.schema.raw(
    "select setval('core$.operation_log_id_operation_log_seq', (select coalesce(MAX(id_operation_log)+1,1) from core$.operation_log))"
  );
  await knex.schema.raw(
    "select setval('core$.password_recovery_request_id_password_recovery_request_seq', (select coalesce(MAX(id_password_recovery_request)+1,1) from core$.password_recovery_request))"
  );
  await knex.schema.raw(
    "select setval('core$.session_id_session_seq', (select coalesce(MAX(id_session)+1,1) from core$.session))"
  );
  await knex.schema.raw(
    "select setval('core$.signup_request_id_signup_request_seq', (select coalesce(MAX(id_signup_request)+1,1) from core$.signup_request))"
  );
  await knex.schema.raw("select setval('core$.user_id_user_seq', (select coalesce(MAX(id_user)+1,1) from core$.user))");

  await knex.schema.raw(
    "select setval('msg$.message_id_message_seq', (select coalesce(MAX(id_message)+1,1) from msg$.message))"
  );
}

export async function down(knex: Knex): Promise<void> {
  return Promise.resolve();
}
