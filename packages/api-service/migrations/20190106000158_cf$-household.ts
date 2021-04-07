import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('cf$').createTable('household', table => {
    table.comment('Домохозяйство');

    table.specificType('id_household', 'serial').notNullable().primary('household_pk').comment('ID домохозяйства');
  });

  await knex.schema.raw('GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE "cf$".household TO web;');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('cf$.household');
}
