import { Knex } from 'knex';

import { create_v1 } from './cf$_contractor/create.function/v1';
import { destroy_v1 } from './cf$_contractor/destroy.function/v1';
import { get_v1 } from './cf$_contractor/get.function/v1';
import { update_v1 } from './cf$_contractor/update.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA cf$_contractor;');
  await knex.schema.raw('REVOKE ALL ON SCHEMA "cf$_contractor" FROM PUBLIC;');
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

  await knex.schema.raw('DROP SCHEMA cf$_contractor;');
}
