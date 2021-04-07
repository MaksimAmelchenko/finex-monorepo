import * as Knex from 'knex';

import { create_v1 } from './cf$_ie_item/create.function/v1';
import { destroy_v1 } from './cf$_ie_item/destroy.function/v1';
import { get_v1 } from './cf$_ie_item/get.function/v1';
import { update_v1 } from './cf$_ie_item/update.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA cf$_ie_item;');
  await knex.schema.raw('REVOKE ALL ON SCHEMA "cf$_ie_item" FROM PUBLIC;');
  await knex.schema.raw(create_v1.up);
  await knex.schema.raw(destroy_v1.up);
  await knex.schema.raw(get_v1.up);
  await knex.schema.raw(update_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(create_v1.down);
  await knex.schema.raw(destroy_v1.down);
  await knex.schema.raw(get_v1.down);
  await knex.schema.raw(update_v1.down);

  await knex.schema.raw('DROP SCHEMA cf$_ie_item;');
}
