import { Knex } from 'knex';

import { call_operation_v1 } from './core$_port/call_operation.function/v1';
import { get_request_info_v1 } from './core$_port/get_request_info.function/v1';
import { set_request_info_v1 } from './core$_port/set_request_info.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA core$_port;');
  await knex.schema.raw('REVOKE ALL ON SCHEMA "core$_port" FROM PUBLIC;');

  await knex.schema.raw(call_operation_v1.up);
  await knex.schema.raw(get_request_info_v1.up);
  await knex.schema.raw(set_request_info_v1.up);
  await knex.schema.raw('GRANT USAGE ON SCHEMA "core$_port" TO web;');
  await knex.schema.raw(
    'GRANT ALL ON FUNCTION "core$_port".call_operation(ioperation_name text, iparams text, OUT oresponse text) TO web;'
  );
  await knex.schema.raw(
    'GRANT ALL ON FUNCTION "core$_port".set_request_info(iname character varying, ivalue character varying) TO web;'
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(call_operation_v1.down);
  await knex.schema.raw(get_request_info_v1.down);
  await knex.schema.raw(set_request_info_v1.down);

  await knex.schema.raw('DROP SCHEMA core$_port;');
}
