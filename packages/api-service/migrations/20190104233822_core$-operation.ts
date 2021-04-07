import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('core$').createTable('operation', table => {
    table.comment('Операция');

    table.integer('id_operation').primary('operation_pk');
    table.text('name').notNullable().unique('operation_name_u');

    table.text('method').notNullable();

    table.boolean('is_enabled').notNullable().defaultTo(true);
    table.boolean('is_need_authorize').notNullable().defaultTo(true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('core$.operation');
}
