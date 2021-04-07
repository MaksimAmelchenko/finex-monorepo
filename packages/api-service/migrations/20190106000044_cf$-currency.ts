import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('cf$').createTable('currency', table => {
    table.comment('Валюта');

    table.integer('id_currency').notNullable().primary('currency_pk');

    table.text('name').notNullable();

    table.text('short_name').notNullable();

    table.text('symbol').notNullable();

    table.text('code').unique('currency_code_u').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('cf$.currency');
}
