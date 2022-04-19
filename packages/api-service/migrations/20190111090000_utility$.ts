import { Knex } from 'knex';

import { copy_data_v1 } from './utility$/copy_data.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA utility$;');
  await knex.schema.raw('REVOKE ALL ON SCHEMA "utility$" FROM PUBLIC;');

  await knex.schema.raw(copy_data_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(copy_data_v1.down);

  await knex.schema.raw('DROP SCHEMA utility$;');
}
