import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('REVOKE USAGE ON SCHEMA "msg$" FROM postman');
  await knex.schema.raw(
    'REVOKE ALL ON FUNCTION "msg$".get_next_message(OUT id_message integer, OUT message text) FROM postman'
  );

  await knex.schema.raw('drop role postman');
}

export async function down(knex: Knex): Promise<void> {}
