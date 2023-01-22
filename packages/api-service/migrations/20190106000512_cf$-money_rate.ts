import { Knex } from 'knex';

import { v_money_rate_v1 } from './cf$/v_money_rate.view/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('cf$').createTable('money_rate', table => {
    table.integer('id_project').notNullable().comment('ID проекта');

    // table
    //   .foreign('id_project', 'money_rate_2_project')
    //   .references('id_project')
    //   .inTable('cf$.project')
    //   .onDelete('cascade');

    table.specificType('id_money_rate', 'serial').notNullable();

    table.integer('id_user');

    // table
    //   .foreign('id_user', 'money_rate_2_user')
    //   .references('id_user')
    //   .inTable('core$.user')
    //   .onDelete('cascade');

    table.integer('id_money').notNullable().comment('ID денги');

    table
      .foreign(['id_project', 'id_money'], 'money_rate_2_money')
      .references(['id_project', 'id_money'])
      .inTable('cf$.money')
      .onDelete('cascade');

    table.date('drate').notNullable().comment('Дата курса');

    table.integer('id_currency').notNullable().comment('ID валюты, к которой указан курс');
    // table
    //   .foreign('id_currency', 'money_rate_2_currency')
    //   .onDelete('cascade')
    //   .references('id_currency')
    //   .inTable('cf$.currency');

    table.specificType('rate', 'numeric').notNullable().comment('Курс');

    table.primary(['id_project', 'id_money_rate'], { constraintName: 'money_rate_pk' });
    table.unique(['id_project', 'id_money', 'drate'], { indexName: 'money_rate_u' });
  });
  await knex.schema.raw(v_money_rate_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(v_money_rate_v1.down);
  await knex.schema.dropTable('cf$.money_rate');
}
