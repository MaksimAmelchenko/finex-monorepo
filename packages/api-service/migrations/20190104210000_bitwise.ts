import { Knex } from 'knex';

import { is_masked_v1 } from './bitwise/is_masked.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA bitwise;');
  await knex.schema.raw(is_masked_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(is_masked_v1.down);
  await knex.schema.raw('DROP SCHEMA bitwise;');
}
