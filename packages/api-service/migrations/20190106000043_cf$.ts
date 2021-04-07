import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA cf$');
  await knex.schema.raw('GRANT USAGE ON SCHEMA "cf$" TO web');
  await knex.schema.raw('REVOKE ALL ON SCHEMA "cf$" FROM PUBLIC');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('DROP SCHEMA cf$;');
}
