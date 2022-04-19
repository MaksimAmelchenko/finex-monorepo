import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA core$;');
  await knex.schema.raw('GRANT USAGE ON SCHEMA "core$" TO web;');
  await knex.schema.raw('REVOKE ALL ON SCHEMA "core$" FROM PUBLIC;');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('DROP SCHEMA core$;');
}
