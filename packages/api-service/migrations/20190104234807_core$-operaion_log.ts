import { Knex } from 'knex';

import { operation_log_tr_bi_v1 } from './core$/operation_log_tr_bi.function/v1';
import { operation_log_bi_trigger_v1 } from './core$/operation_log_bi.trigger/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(operation_log_tr_bi_v1.up);

  await knex.schema
    .withSchema('core$')
    .createTable('operation_log', table => {
      table.specificType('id_operation_log', 'bigserial').primary('operation_log_pk');
      table.integer('id_operation').notNullable();
      // .index('operation_log_id_operation');

      table.integer('id_user');
      table.foreign('id_user', 'operation_log_2_user').references('id_user').inTable('core$.user').onDelete('cascade');

      table.integer('is_error');
      table.specificType('time_spent_ms', 'numeric');
      table.text('params');
      table.text('result');
      table.timestamp('dset');
    })
    .raw(operation_log_bi_trigger_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('core$.operation_log');
  await knex.schema.raw(operation_log_tr_bi_v1.down);
}
