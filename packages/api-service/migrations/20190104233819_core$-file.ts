import { Knex } from 'knex';

import { file_tr_bi_v1 } from './core$/file_tr_bi.function/v1';
import { file_bi_trigger_v1 } from './core$/file_bi.trigger/v1';
import { v_file_v1 } from './core$/v_file.view/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(file_tr_bi_v1.up);
  await knex.schema
    .withSchema('core$')
    .createTable('file', table => {
      table.specificType('id_file', 'serial').primary('file_pk');

      table.integer('id_user').notNullable().index('file_id_user').comment('УИД пользователя');

      table.foreign('id_user', 'file_2_user').references('id_user').inTable('core$.user').onDelete('cascade');

      table.text('name').notNullable();

      table.timestamp('dset').notNullable();

      table.boolean('is_temporary').notNullable().defaultTo(true);

      table.text('encoding').comment('Кодировка файла (utf8, win1251)');

      table.text('content_type').notNullable();

      table.text('inner_name_original_file').notNullable().comment('Внутренее имя исходного файла');

      table.text('inner_name_processed_file');

      table.comment('Описание загруженного файла');
    })
    .raw(file_bi_trigger_v1.up);
  await knex.schema.raw(v_file_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(v_file_v1.down);
  await knex.schema.dropTable('core$.file');
  await knex.schema.raw(file_tr_bi_v1.down);
}
