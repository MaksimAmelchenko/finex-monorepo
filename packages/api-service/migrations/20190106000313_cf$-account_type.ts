import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('cf$').createTable('account_type', table => {
    table.specificType('id_account_type', 'smallint').notNullable().primary('account_type_pk').comment('ID типа счета');

    table.text('name').notNullable();
    table.text('short_name').notNullable();
  });

  await knex.schema.raw(`
        insert
          into cf$.account_type ( id_account_type, name, short_name )
        values ( 1, 'Наличные', 'Наличные' ),
               ( 2, 'Карта', 'Карта' ),
               ( 3, 'Банковский счет', 'Счет' ),
               ( 4, 'Банковский вклад', 'Вклад' ),
               ( 5, 'Другое', 'Другое' ),
               ( 6, 'Кредитная карта', 'Кредитка' ),
               ( 7, 'Долг', 'Долг' ),
               ( 8, 'Электронные деньги', 'Электронные деньги' ),
               ( 9, 'Депозитная карта', 'Депозитная карта' );
    `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('cf$.account_type');
}
