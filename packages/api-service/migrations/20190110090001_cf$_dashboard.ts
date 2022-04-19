import { Knex } from 'knex';
import { balances_v1 } from './cf$_dashboard/balances.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA cf$_dashboard;');
  await knex.schema.raw('REVOKE ALL ON SCHEMA "cf$_dashboard" FROM PUBLIC;');
  await knex.schema.raw(balances_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(balances_v1.down);

  await knex.schema.raw('DROP SCHEMA cf$_dashboard;');
}
