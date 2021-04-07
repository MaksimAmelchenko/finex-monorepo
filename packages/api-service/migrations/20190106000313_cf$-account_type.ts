import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('cf$').createTable('account_type', table => {
    table.specificType('id_account_type', 'smallint').notNullable().primary('account_type_pk').comment('ID типа счета');

    table.text('name').notNullable();
    table.text('short_name').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('cf$.account_type');
}
