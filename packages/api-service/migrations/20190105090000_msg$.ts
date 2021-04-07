import * as Knex from 'knex';

import { add_attachment_v1 } from './msg$/add_attachment.function/v1';
import { add_message_v1 } from './msg$/add_message.function/v1';
import { get_message_content_v1 } from './msg$/get_message_content.function/v1';
import { get_next_message_v1 } from './msg$/get_next_message.function/v1';
import { message_attachment_bi_v1 } from './msg$/message_attachment_bi.function/v1';
import { message_attachment_bi_trigger_v1 } from './msg$/message_attachment_bi.trigger/v1';
import { message_bi_v1 } from './msg$/message_bi.function/v1';
import { message_bi_trigger_v1 } from './msg$/message_bi.trigger/v1';
import { send_v1 } from './msg$/send.function/v1';
import { set_message_status_v1 } from './msg$/set_message_status.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA msg$;');
  await knex.schema.raw(get_next_message_v1.up);
  await knex.schema.raw(message_attachment_bi_v1.up);
  await knex.schema.raw(message_bi_v1.up);

  await knex.schema
    .withSchema('msg$')
    .createTable('message', table => {
      table.specificType('id_message', 'serial').notNullable().primary('message_pk');

      table.integer('id_user').index('message_id_user').comment('ID пользователя');

      table.foreign('id_user', 'message_2_user').references('id_user').inTable('core$.user').onDelete('cascade');

      table.text('from_name').comment('Имя отправителя');

      table.text('from_address').notNullable().comment('Адрес отправителя');

      table.text('To').notNullable().comment('Адрес получателя');

      table.text('cc').comment('Адрес получателя копии');

      table.text('subject').notNullable().comment('Тема');

      table.text('text_content').comment('Текстовое содержание письма');

      table.text('html_content').comment('HTML содержание письма');

      table
        .specificType('priority', 'smallint')
        .defaultTo(3)
        .notNullable()
        .comment('Приоритет отправки: 1- наивысший, 5 - низкий');

      table.boolean('is_processed').defaultTo(false).notNullable().comment('Флаг "Обработанное"');

      table.boolean('is_error').defaultTo(false).notNullable().comment('Флаг "Ошибка отправки"');

      table.timestamp('dset').notNullable().comment('Дата постановки в очередь');

      table.timestamp('dbegin_processing').comment('Дата начала обработки');

      table.timestamp('dend_processing').comment('Дата окончания обработки');

      table.text('message_id').comment('ID сообщения сервера исходящей почты');

      table.text('error_message');
    })
    .raw(message_bi_trigger_v1.up)
    .raw(
      `
      CREATE INDEX message_is_processed ON msg$.message
        USING btree (is_processed)
        WHERE (is_processed = false);
    `
    );

  await knex.schema
    .withSchema('msg$')
    .createTable('message_attachment', table => {
      table.integer('id_message').notNullable();

      table.integer('id_file').notNullable();

      table.unique(['id_message', 'id_file'], 'message_attachment_id_message_id_file_u');

      table
        .foreign('id_message', 'message_attachment_2_message')
        .references('id_message')
        .inTable('msg$.message')
        .onDelete('cascade');

      table
        .foreign('id_file', 'message_attachment_2_file')
        .references('id_file')
        .inTable('core$.file')
        .onDelete('cascade');
    })
    .raw(message_attachment_bi_trigger_v1.up);

  await knex.schema.withSchema('msg$').createTable('message_template', table => {
    table.comment('Шаблон сообщения');

    table
      .integer('id_message_template')
      .notNullable()
      .unique('message_template_id_message_template')
      .comment('ID шаблона');

    table.text('name').comment('Наименование шаблона');

    table.text('text_template').comment('Шаблон текстовой версии');

    table.text('html_template').comment('Шаблон html-версии');
  });

  await knex.schema.raw(add_attachment_v1.up);
  await knex.schema.raw(add_message_v1.up);
  await knex.schema.raw(get_message_content_v1.up);
  await knex.schema.raw(send_v1.up);
  await knex.schema.raw(set_message_status_v1.up);

  await knex.schema.raw('GRANT USAGE ON SCHEMA "msg$" TO postman;');
  await knex.schema.raw(
    'GRANT ALL ON FUNCTION "msg$".get_next_message(OUT id_message integer, OUT message text) TO postman;'
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(add_attachment_v1.down);
  await knex.schema.raw(add_message_v1.down);
  await knex.schema.raw(get_message_content_v1.down);
  await knex.schema.raw(send_v1.down);
  await knex.schema.raw(set_message_status_v1.down);

  await knex.schema.dropTable('msg$.message_template');
  await knex.schema.dropTable('msg$.message_attachment');
  await knex.schema.dropTable('msg$.message');

  await knex.schema.raw(get_next_message_v1.down);
  await knex.schema.raw(message_attachment_bi_v1.down);
  await knex.schema.raw(message_bi_v1.down);

  await knex.schema.raw('DROP SCHEMA msg$;');
}
