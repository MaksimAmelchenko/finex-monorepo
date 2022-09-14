import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('GRANT USAGE ON SCHEMA "cf$_plan" TO web');
  await knex.schema.raw('GRANT INSERT, SELECT, UPDATE ON TABLE cf$.plan TO web');
  await knex.schema.raw('GRANT INSERT, SELECT, UPDATE ON TABLE cf$.plan_cashflow_item TO web');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('REVOKE USAGE ON SCHEMA "cf$_plan" FROM web');
  await knex.schema.raw('REVOKE INSERT, SELECT, UPDATE ON TABLE cf$.plan FROM web');
  await knex.schema.raw('REVOKE INSERT, SELECT, UPDATE ON TABLE cf$.plan_cashflow_item FROM web');
}
