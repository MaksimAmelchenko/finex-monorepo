import { Knex } from 'knex';

import { random_string_v1 } from './core$/random_string.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(random_string_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(random_string_v1.down);
}
