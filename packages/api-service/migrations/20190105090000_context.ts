import { Knex } from 'knex';

import { set__bigint_boolean_v1 } from './context/set__bigint_boolean.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(set__bigint_boolean_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(set__bigint_boolean_v1.down);
}
