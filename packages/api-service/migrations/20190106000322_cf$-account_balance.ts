import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('cf$').createTable('account_balance', table => {
    table.comment('Сальдо счета');

    table.integer('id_project').notNullable().comment('ID проекта');

    // table
    //   .foreign('id_project', 'account_balance_2_project')
    //   .references('id_project')
    //   .inTable('cf$.project')
    //   .onDelete('cascade');

    table.integer('id_account').notNullable().comment('ID счета');

    table
      .foreign(['id_project', 'id_account'], 'account_balance_2_account')
      .references(['id_project', 'id_account'])
      .inTable('cf$.account')
      .onDelete('cascade');

    table.integer('id_money').notNullable().comment('ID валюты');

    table.date('dbalance').notNullable().comment('Дата');

    table.specificType('sum_in', 'numeric').notNullable().comment('Сумма дохода');

    table.specificType('sum_out', 'numeric').notNullable().comment('Сумма расхода');

    table.unique(['id_project', 'id_account', 'dbalance', 'id_money'], 'account_balance_u');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('cf$.account_balance');
}
