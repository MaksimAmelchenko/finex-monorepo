import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('core$').alterTable('session', table => {
    table.text('timeout');
  });
  await knex.schema.withSchema('core$').alterTable('user', table => {
    table.text('timeout').defaultTo('PT1H');
  });
  await knex.schema.raw(`
    update core$.user set timeout = 'PT1H';
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('core$').alterTable('session', table => {
    table.dropColumn('timeout');
  });
  await knex.schema.withSchema('core$').alterTable('user', table => {
    table.dropColumn('timeout');
  });
}
