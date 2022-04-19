import { Knex } from 'knex';

import { to_date_v1 } from './sanitize$/to_date.function/v1';
import { to_int_array_v1 } from './sanitize$/to_int_array.function/v1';
import { to_numeric_v1 } from './sanitize$/to_numeric.function/v1';
import { to_string_v1 } from './sanitize$/to_string.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA sanitize$;');
  await knex.schema.raw(to_date_v1.up);
  await knex.schema.raw(to_int_array_v1.up);
  await knex.schema.raw(to_numeric_v1.up);
  await knex.schema.raw(to_string_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(to_date_v1.down);
  await knex.schema.raw(to_int_array_v1.down);
  await knex.schema.raw(to_numeric_v1.down);
  await knex.schema.raw(to_string_v1.down);
  await knex.schema.raw('DROP SCHEMA sanitize$;');
}
