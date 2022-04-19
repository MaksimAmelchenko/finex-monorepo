import { Knex } from 'knex';
import { _get_v1 } from './context/_get.function/v1';
import { clear_v1 } from './context/clear.function/v1';
import { get_v1 } from './context/get.function/v1';
import { set__text_text_boolean_v1 } from './context/set__text_text_boolean.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA context;');
  await knex.schema.raw(_get_v1.up);
  await knex.schema.raw(clear_v1.up);
  await knex.schema.raw(get_v1.up);
  await knex.schema.raw(set__text_text_boolean_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(_get_v1.down);
  await knex.schema.raw(clear_v1.down);
  await knex.schema.raw(get_v1.down);
  await knex.schema.raw(set__text_text_boolean_v1.down);
  await knex.schema.raw('DROP SCHEMA context;');
}
