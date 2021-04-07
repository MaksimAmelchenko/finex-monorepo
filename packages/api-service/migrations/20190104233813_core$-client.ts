import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('core$').createTable('client', table => {
    table.integer('id_client').primary('client_pk');
    table.text('name');
    table.text('api_key');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('core$.client');
}
