import { Knex } from 'knex';
import { user_ad_v1 } from './core$/user_ad.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(user_ad_v1.up);
  await knex.schema.withSchema('core$').alterTable('user', table => {
    table.foreign(['id_household'], 'user_2_household').references(['id_household']).inTable('cf$.household');

    table.foreign(['id_project'], 'user_2_project').references(['id_project']).inTable('cf$.project');

    table
      .foreign(['id_currency_rate_source'], 'user_2_currency_rate_source')
      .references(['id_currency_rate_source'])
      .inTable('cf$.currency_rate_source');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('core$').alterTable('user', table => {
    table.dropForeign(['id_household'], 'user_2_household');
    table.dropForeign(['id_project'], 'user_2_project');
    table.dropForeign(['id_currency_rate_source'], 'user_2_currency_rate_source');
    table.dropForeign(['id_user_status'], 'user_2_user_status');
  });
}
