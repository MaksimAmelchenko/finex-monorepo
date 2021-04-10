import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('core$').createTable('user_status', table => {
    table.specificType('id_user_status', 'smallint').primary('user_status_pk').comment('ID статуса пользователя');
    table.text('name').notNullable().comment('Наименование');
  });

  await knex.schema.raw(`
        insert
          into core$.user_status ( id_user_status, name )
        values ( 1, 'Нормальный' ),
               ( 2, 'В процессе миграции' ),
               ( 3, 'Мигрирован на другой шард' );
    `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('core$.user_status');
}
