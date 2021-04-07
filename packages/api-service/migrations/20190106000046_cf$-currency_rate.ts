import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('cf$').createTable('currency_rate', table => {
    table.comment('1 - http://openexchangerates.org/  2 - http://www.cbr.ru/');

    table.specificType('id_currency_rate_source', 'smallint');

    table.integer('id_currency');

    table.date('drate');

    table.specificType('rate', 'numeric');

    table.unique(
      ['id_currency_rate_source', 'id_currency', 'drate'],
      'currency_rate_id_currency_rate_source_id_currency_drate'
    );
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('cf$.currency_rate');
}
