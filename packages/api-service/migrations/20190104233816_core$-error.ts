import * as Knex from 'knex';
import { v_error_v1 } from './core$/v_error.view/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('core$').createTable('error', table => {
    table
      .text('code')
      // .notNullable()
      .unique();
    table.integer('status').notNullable().comment('HTTP Status');
    table.text('message');
    table.text('dev_message');
    table.text('more_info');
    table.text('note');
  });
  await knex.schema.raw(v_error_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(v_error_v1.down);
  await knex.schema.dropTable('core$.error');
}
