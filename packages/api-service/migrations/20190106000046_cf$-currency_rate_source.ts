import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('cf$').createTable('currency_rate_source', table => {
    table.specificType('id_currency_rate_source', 'smallint').primary('currency_rate_source_pk');
    table.text('name');
  });

  await knex.schema.raw(`
        insert
          into cf$.currency_rate_source ( id_currency_rate_source, name )
        values ( 2, 'Центробанк РФ' ),
               ( 1, 'Open Exchange Rates' );
    `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('cf$.currency_rate_source');
}
