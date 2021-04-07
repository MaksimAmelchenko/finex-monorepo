import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('core$').createTable('user_status', table => {
    table.specificType('id_user_status', 'smallint').primary('user_status_pk').comment('ID статуса пользователя');

    table.text('name').notNullable().comment('Наименование');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('core$.user_status');
}
