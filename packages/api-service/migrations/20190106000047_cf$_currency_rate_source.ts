import { Knex } from 'knex';

import { get_v1 } from './cf$_currency_rate_source/get.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA cf$_currency_rate_source;');
  await knex.schema.raw('REVOKE ALL ON SCHEMA "cf$_currency_rate_source" FROM PUBLIC;');
  await knex.schema.raw(get_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(get_v1.down);

  await knex.schema.raw('DROP SCHEMA cf$_currency_rate_source;');
}
