import * as Knex from 'knex';
import { user_ad_v1 } from './core$/user_ad.function/v1';
import { user_ad_trigger_v1 } from './core$/user_ad.trigger/v1';

import { v_user_v1 } from './core$/v_user.view/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(user_ad_v1.up);
  await knex.schema
    .withSchema('core$')
    .createTable('user', table => {
      table.comment('Пользователь');

      table.specificType('id_user', 'serial').notNullable().primary('user_pk').comment('ID пользователя');

      table.text('name').notNullable().comment('Наименование');

      table.text('email').notNullable().comment('Логин');

      table.text('password').notNullable().comment('Хэш пароля');

      table.text('tz').comment('Временная зона');

      table.integer('id_household').notNullable().index('user_id_household').comment('ID домохозяйства');

      table.integer('id_project').comment('ID проекта');

      table
        .specificType('id_currency_rate_source', 'smallint')

        .notNullable()
        .comment('ID источника курса валют');

      table.specificType('id_user_status', 'smallint').notNullable().defaultTo(1).comment('ID статуса пользователя');

      table
        .foreign(['id_user_status'], 'user_2_user_status')
        .references(['id_user_status'])
        .inTable('core$.user_status');
    })
    .raw('create unique index users_email_u on core$.user using btree(upper(email));')
    .raw("alter table core$.user add constraint user_email_is_empty check(btrim(email) <> '');")
    .raw('alter table core$.user add constraint user_email_is_too_long check(length(email) < 50);')
    .raw("alter table core$.user add constraint user_name_is_empty check(btrim(name) <> '');")
    .raw('alter table core$.user add constraint user_name_is_too_long check(length(name) < 50);')
    .raw(user_ad_trigger_v1.up);

  await knex.schema.raw(v_user_v1.up);

  await knex.schema.raw('GRANT INSERT, SELECT, UPDATE ON TABLE "core$".user TO web;');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(v_user_v1.down);
  await knex.schema.dropTable('core$.user');
  await knex.schema.raw(user_ad_v1.down);
}
