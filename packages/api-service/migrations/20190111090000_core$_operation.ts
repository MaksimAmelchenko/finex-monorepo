import { Knex } from 'knex';

import { call_v1 } from './core$_operation/call.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA core$_operation;');
  await knex.schema.raw('REVOKE ALL ON SCHEMA "core$_operation" FROM PUBLIC;');

  await knex.schema.raw(call_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(call_v1.down);

  await knex.schema.raw('DROP SCHEMA core$_operation;');
}
