import { Knex } from 'knex';

import { csv_to_jsonb_v1 } from './json/csv_to_jsonb.function/v1';
import { format__date_v1 } from './json/format__date.function/v1';
import { format__timestamp_with_time_zone_v1 } from './json/format__timestamp_with_time_zone.function/v1';
import { list_v1 } from './json/list.function/v1';
import { object_v1 } from './json/object.function/v1';
import { to_json__boolean_v1 } from './json/to_json__boolean.function/v1';
import { to_json__character_varying_v1 } from './json/to_json__character_varying.function/v1';
import { to_json__date_v1 } from './json/to_json__date.function/v1';
import { to_json__numeric_v1 } from './json/to_json__numeric.function/v1';
import { to_json__timestamp_with_time_zone_v1 } from './json/to_json__timestamp_with_time_zone.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA json;');
  await knex.schema.raw(csv_to_jsonb_v1.up);
  await knex.schema.raw(format__date_v1.up);
  await knex.schema.raw(format__timestamp_with_time_zone_v1.up);
  await knex.schema.raw(list_v1.up);
  await knex.schema.raw(object_v1.up);
  await knex.schema.raw(to_json__boolean_v1.up);
  await knex.schema.raw(to_json__character_varying_v1.up);
  await knex.schema.raw(to_json__date_v1.up);
  await knex.schema.raw(to_json__numeric_v1.up);
  await knex.schema.raw(to_json__timestamp_with_time_zone_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(csv_to_jsonb_v1.down);
  await knex.schema.raw(format__date_v1.down);
  await knex.schema.raw(format__timestamp_with_time_zone_v1.down);
  await knex.schema.raw(list_v1.down);
  await knex.schema.raw(object_v1.down);
  await knex.schema.raw(to_json__boolean_v1.down);
  await knex.schema.raw(to_json__character_varying_v1.down);
  await knex.schema.raw(to_json__date_v1.down);
  await knex.schema.raw(to_json__numeric_v1.down);
  await knex.schema.raw(to_json__timestamp_with_time_zone_v1.down);
  await knex.schema.raw('DROP SCHEMA json;');
}
