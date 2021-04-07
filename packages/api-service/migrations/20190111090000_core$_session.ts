import * as Knex from 'knex';

import { get_v1 } from './core$_session/get.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA core$_session;');
  await knex.schema.raw('REVOKE ALL ON SCHEMA "core$_session" FROM PUBLIC;');

  await knex.schema.raw(get_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(get_v1.down);

  await knex.schema.raw('DROP SCHEMA core$_session;');
}
