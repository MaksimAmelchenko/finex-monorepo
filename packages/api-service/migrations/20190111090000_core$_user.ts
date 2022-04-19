import { Knex } from 'knex';

import { get_v1 } from './core$_user/get.function/v1';
import { get_dlast_signin_v1 } from './core$_user/get_dlast_signin.function/v1';
import { is_new_v1 } from './core$_user/is_new.function/v1';
import { migrate_v1 } from './core$_user/migrate.function/v1';
import { remove_v1 } from './core$_user/remove.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA core$_user;');
  await knex.schema.raw('REVOKE ALL ON SCHEMA "core$_user" FROM PUBLIC;');

  await knex.schema.raw(get_v1.up);
  await knex.schema.raw(get_dlast_signin_v1.up);
  await knex.schema.raw(is_new_v1.up);
  await knex.schema.raw(migrate_v1.up);
  await knex.schema.raw(remove_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(get_v1.down);
  await knex.schema.raw(get_dlast_signin_v1.down);
  await knex.schema.raw(is_new_v1.down);
  await knex.schema.raw(migrate_v1.down);
  await knex.schema.raw(remove_v1.down);

  await knex.schema.raw('DROP SCHEMA core$_user;');
}
