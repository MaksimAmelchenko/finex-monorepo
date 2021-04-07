import * as Knex from 'knex';

import { change_log_bi_v1 } from './cf$/change_log_bi.function/v1';
import { change_log_bi_trigger_v1 } from './cf$/change_log_bi.trigger/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(change_log_bi_v1.up);

  await knex.schema
    .withSchema('cf$')
    .createTable('change_log', table => {
      table.specificType('id_change_log', 'serial').notNullable().comment('ID обновления');

      table.text('title').notNullable().comment('Заголовок обновления');
      table.text('description').notNullable().comment('html - описание обновления');
      table.timestamp('dset').notNullable().comment('Дата установки обновления');
    })
    .raw(change_log_bi_trigger_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('cf$.change_log');
  await knex.schema.raw(change_log_bi_v1.down);
}
