import { Knex } from 'knex';

import { base64_encode_v1 } from './lib/base64_encode.function/v1';
import { console_log_v1 } from './lib/console_log.function/v1';
import { crlf_v1 } from './lib/crlf.function/v1';
import { csv_to_array_v1 } from './lib/csv_to_array.function/v1';
import { csv_to_arrays_v1 } from './lib/csv_to_arrays.function/v1';
import { to_char_v1 } from './lib/to_char.function/v1';
import { to_date_v1 } from './lib/to_date.function/v1';
import { to_numeric_v1 } from './lib/to_numeric.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA lib;');
  await knex.schema.raw(base64_encode_v1.up);
  await knex.schema.raw(console_log_v1.up);
  await knex.schema.raw(crlf_v1.up);
  await knex.schema.raw(csv_to_array_v1.up);
  await knex.schema.raw(csv_to_arrays_v1.up);
  await knex.schema.raw(to_char_v1.up);
  await knex.schema.raw(to_date_v1.up);
  await knex.schema.raw(to_numeric_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(base64_encode_v1.down);
  await knex.schema.raw(console_log_v1.down);
  await knex.schema.raw(crlf_v1.down);
  await knex.schema.raw(csv_to_array_v1.down);
  await knex.schema.raw(csv_to_arrays_v1.down);
  await knex.schema.raw(to_char_v1.down);
  await knex.schema.raw(to_date_v1.down);
  await knex.schema.raw(to_numeric_v1.down);
  await knex.schema.raw('DROP SCHEMA lib;');
}
