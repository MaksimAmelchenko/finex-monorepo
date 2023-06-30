import { Knex } from 'knex';

import { copy__integer_integer_v1 } from './cf$_project/copy__integer_integer.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(copy__integer_integer_v1.up);
}

export async function down(knex: Knex): Promise<void> {}
