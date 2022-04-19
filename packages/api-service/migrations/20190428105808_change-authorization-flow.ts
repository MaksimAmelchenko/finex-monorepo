import { Knex } from 'knex';

import { call_operation_v1 } from './core$_port/call_operation.function/v1';
import { call_operation__uuid_text_text_v1 } from './core$_port/call_operation__uuid_text_text.function/v1';

import { set__uuid_boolean_v1 } from './context/set__uuid_boolean.function/v1';
import { set__bigint_boolean_v1 } from './context/set__bigint_boolean.function/v1';

import { authorize_v1 } from './core$_auth/authorize.function/v1';
import { authenticate_v1 } from './core$_auth/authenticate.function/v1';
import { session_bi_trigger_v1 } from './core$/session_bi.trigger/v1';
import { session_tr_bi_v1 } from './core$/session_tr_bi.function/v1';
import { use_v2 } from './cf$_project/use.function/v2';
import { get_v2 } from './core$_session/get.function/v2';
import { get_dlast_signin_v2 } from './core$_user/get_dlast_signin.function/v2';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(call_operation_v1.down);
  await knex.raw(authorize_v1.down);
  await knex.raw(set__bigint_boolean_v1.down);
  await knex.raw(authenticate_v1.down);

  await knex.raw('CREATE EXTENSION "uuid-ossp"');
  await knex.schema.withSchema('core$').alterTable('session', table => {
    table.uuid('id').unique();
    table.text('user_agent');
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    table.timestamp('last_access_time').notNullable().defaultTo(knex.fn.now()).alter();
  });

  await knex.raw(`
    update core$.session
       set id = uuid_generate_v4(),
           timeout = 'PT1H',
           is_active = false,
           created_at = dSet,
           updated_at = last_access_time
  `);

  await knex.schema.raw(session_bi_trigger_v1.down);
  await knex.schema.raw(session_tr_bi_v1.down);
  await knex.schema.raw(use_v2.up);
  await knex.schema.raw(get_v2.up);
  await knex.schema.raw(get_dlast_signin_v2.up);

  await knex.schema.withSchema('core$').alterTable('session', table => {
    table.uuid('id').notNullable().alter();
    table.text('timeout').notNullable().alter();

    table.dropColumn('id_session');
    table.dropColumn('token');
    table.dropColumn('dset');
  });

  await knex.raw(set__uuid_boolean_v1.up);
  await knex.raw(call_operation__uuid_text_text_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(call_operation__uuid_text_text_v1.down);
  await knex.raw(set__uuid_boolean_v1.down);

  await knex.schema.withSchema('core$').alterTable('session', table => {
    table.specificType('id_session', 'bigserial');
    table.text('token').unique('session_token');
    table.timestamp('dset');
  });

  await knex.raw(`
    update core$.session
       set id_session = nextval('core$.session_id_session_seq'),
           token = uuid_generate_v4()::text,
           dset = last_access_time
  `);

  await knex.schema.withSchema('core$').alterTable('session', table => {
    table.primary(['id_session'], 'session_pk');
    table.text('token').notNullable().alter();
  });

  await knex.schema.withSchema('core$').alterTable('session', table => {
    table.dropColumn('id');
    table.dropColumn('is_active');
    table.dropColumn('user_agent');
    table.dropTimestamps();
    table.timestamp('last_access_time').notNullable().alter();
  });

  await knex.schema.raw(use_v2.down);
  await knex.schema.raw(get_v2.down);
  await knex.schema.raw(get_dlast_signin_v2.down);

  await knex.schema.raw(session_tr_bi_v1.up);
  await knex.schema.raw(session_bi_trigger_v1.up);

  await knex.raw(authenticate_v1.up);

  await knex.raw(set__bigint_boolean_v1.up);
  await knex.raw(authorize_v1.up);

  await knex.raw(call_operation_v1.up);
  await knex.raw('DROP EXTENSION "uuid-ossp"');
}
