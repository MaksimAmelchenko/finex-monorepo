import { Knex } from 'knex';

import { create_v1 } from './cf$_category/create.function/v1';
import { destroy_v1 } from './cf$_category/destroy.function/v1';
import { full_name_v1 } from './cf$_category/full_name.function/v1';
import { get_v1 } from './cf$_category/get.function/v1';
import { get_category_by_prototype_v1 } from './cf$_category/get_category_by_prototype.function/v1';
import { get_empty_category_v1 } from './cf$_category/get_empty_category.function/v1';
import { move_v1 } from './cf$_category/move.function/v1';
import { update_v1 } from './cf$_category/update.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA cf$_category;');
  await knex.schema.raw('REVOKE ALL ON SCHEMA "cf$_category" FROM PUBLIC;');
  await knex.schema.raw(create_v1.up);
  await knex.schema.raw(destroy_v1.up);
  await knex.schema.raw(full_name_v1.up);
  await knex.schema.raw(get_v1.up);
  await knex.schema.raw(get_category_by_prototype_v1.up);
  await knex.schema.raw(get_empty_category_v1.up);
  await knex.schema.raw(move_v1.up);
  await knex.schema.raw(update_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(create_v1.down);
  await knex.schema.raw(destroy_v1.down);
  await knex.schema.raw(full_name_v1.down);
  await knex.schema.raw(get_v1.down);
  await knex.schema.raw(get_category_by_prototype_v1.down);
  await knex.schema.raw(get_empty_category_v1.down);
  await knex.schema.raw(move_v1.down);
  await knex.schema.raw(update_v1.down);

  await knex.schema.raw('DROP SCHEMA cf$_category;');
}
