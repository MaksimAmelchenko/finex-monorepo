import { Knex } from 'knex';

import { session_tr_bi_v1 } from './core$/session_tr_bi.function/v1';
import { session_bi_trigger_v1 } from './core$/session_bi.trigger/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(session_tr_bi_v1.up);

  await knex.schema
    .withSchema('core$')
    .createTable('session', table => {
      table.comment('Сессия');

      table.specificType('id_session', 'bigserial').primary('session_pk');
      table.text('token').notNullable().unique('session_token');

      table.integer('id_user').notNullable().index('session_id_user');
      table.foreign('id_user', 'session_2_user').references('id_user').inTable('core$.user').onDelete('cascade');

      table
        .timestamp('last_access_time')
        .notNullable()
        .comment('Время последнего доступа (для удаления старых сессий)');

      table.specificType('ip', 'inet');

      table.integer('requests_count').comment('Кол-во сделаных запросов');

      table.integer('id_project');

      table.timestamp('dset');
    })
    .raw(session_bi_trigger_v1.up);

  await knex.schema.raw('GRANT INSERT, SELECT, UPDATE ON TABLE "core$".session TO web;');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('core$.session');
  await knex.schema.raw(session_tr_bi_v1.down);
}
