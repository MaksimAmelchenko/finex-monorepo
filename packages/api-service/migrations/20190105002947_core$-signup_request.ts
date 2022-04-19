import { Knex } from 'knex';

import { signup_request_bi_v1 } from './core$/signup_request_bi.function/v1';
import { signup_request_bi_trigger_v1 } from './core$/signup_request_bi.trigger/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(signup_request_bi_v1.up);

  await knex.schema
    .withSchema('core$')
    .createTable('signup_request', table => {
      table
        .specificType('id_signup_request', 'serial')
        .primary('signup_request_pk')
        .comment('ID запроса на регистрацию');

      table.text('name').comment('Имя пользователя');
      table.text('email').comment('Адрес электронной почты/логин');
      table.text('password');
      table.timestamp('dset').comment('Дата регистрации');
      table.text('token').unique('signup_request_token').comment('Токен для идентификации данной записи');

      table.timestamp('dconfirm').comment('Дата подтверждения e-mail');
    })
    .raw(signup_request_bi_trigger_v1.up);

  await knex.schema.raw('GRANT INSERT, SELECT, UPDATE ON TABLE "core$".signup_request TO web;');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('core$.signup_request');
  await knex.schema.raw(signup_request_bi_v1.down);
}
