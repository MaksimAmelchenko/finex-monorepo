import { Knex } from 'knex';
import { get_session_timeout_v1 } from './core$_cfg/get_session_timeout.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA core$_cfg;');
  await knex.schema.raw('REVOKE ALL ON SCHEMA "core$_cfg" FROM PUBLIC;');
  await knex.schema.raw(get_session_timeout_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(get_session_timeout_v1.down);

  await knex.schema.raw('DROP SCHEMA core$_cfg;');
}
