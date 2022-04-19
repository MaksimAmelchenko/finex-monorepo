import { Knex } from 'knex';

import { get_name_v1 } from './cf$_account/get_name.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA cf$_account;');
  await knex.schema.raw('REVOKE ALL ON SCHEMA "cf$_account" FROM PUBLIC;');
  await knex.schema.raw(get_name_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(get_name_v1.down);

  await knex.schema.raw('DROP SCHEMA cf$_account;');
}
