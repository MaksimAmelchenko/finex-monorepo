import { Knex } from 'knex';

import { get_v1 } from './cf$_profile/get.function/v1';
import { update_v1 } from './cf$_profile/update.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA cf$_profile;');
  await knex.schema.raw('REVOKE ALL ON SCHEMA "cf$_profile" FROM PUBLIC;');
  await knex.schema.raw(get_v1.up);
  await knex.schema.raw(update_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(get_v1.down);
  await knex.schema.raw(update_v1.down);

  await knex.schema.raw('DROP SCHEMA cf$_profile;');
}
