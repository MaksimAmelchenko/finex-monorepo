import * as Knex from 'knex';

import { balance__date_integer_v1 } from './cf$_debt/balance__date_integer.function/v1';
import { balance__jsonb_v1 } from './cf$_debt/balance__jsonb.function/v1';
import { create_v1 } from './cf$_debt/create.function/v1';
import { destroy_v1 } from './cf$_debt/destroy.function/v1';
import { get_v1 } from './cf$_debt/get.function/v1';
import { update_v1 } from './cf$_debt/update.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA cf$_debt;');
  await knex.schema.raw('REVOKE ALL ON SCHEMA "cf$_debt" FROM PUBLIC;');
  await knex.schema.raw(balance__date_integer_v1.up);
  await knex.schema.raw(balance__jsonb_v1.up);
  await knex.schema.raw(create_v1.up);
  await knex.schema.raw(destroy_v1.up);
  await knex.schema.raw(get_v1.up);
  await knex.schema.raw(update_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(balance__date_integer_v1.down);
  await knex.schema.raw(balance__jsonb_v1.down);
  await knex.schema.raw(create_v1.down);
  await knex.schema.raw(destroy_v1.down);
  await knex.schema.raw(get_v1.down);
  await knex.schema.raw(update_v1.down);

  await knex.schema.raw('DROP SCHEMA cf$_debt;');
}
