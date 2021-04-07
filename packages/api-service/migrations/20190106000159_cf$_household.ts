import * as Knex from 'knex';

import { member_v1 } from './cf$_household/member.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA cf$_household;');
  await knex.schema.raw('REVOKE ALL ON SCHEMA "cf$_household" FROM PUBLIC;');
  await knex.schema.raw(member_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(member_v1.down);
  await knex.schema.raw('DROP SCHEMA cf$_household;');
}
