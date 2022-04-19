import { Knex } from 'knex';

import { destroy_v1 } from './cf$_project/destroy.function/v1';
import { get_v1 } from './cf$_project/get.function/v1';
import { update_v1 } from './cf$_project/update.function/v1';
import { use_v1 } from './cf$_project/use.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(destroy_v1.up);
  await knex.schema.raw(get_v1.up);
  await knex.schema.raw(update_v1.up);
  await knex.schema.raw(use_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(destroy_v1.down);
  await knex.schema.raw(get_v1.down);
  await knex.schema.raw(update_v1.down);
  await knex.schema.raw(use_v1.down);
}
