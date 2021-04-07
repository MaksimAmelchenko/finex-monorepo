import * as Knex from 'knex';

import { account_bi_v1 } from './cf$/account_bi.function/v1';
import { account_bi_trigger_v1 } from './cf$/account_bi.trigger/v1';
import { account_bud_check_permit_v1 } from './cf$/account_bud_check_permit.function/v1';
import { account_bud_check_permit_trigger_v1 } from './cf$/account_bud_check_permit.trigger/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(account_bi_v1.up);

  await knex.schema
    .withSchema('cf$')
    .createTable('account', table => {
      table.comment('Счет');

      table.integer('id_project').notNullable().comment('ID проекта');

      table
        .foreign('id_project', 'account_2_project')
        .references('id_project')
        .inTable('cf$.project')
        .onDelete('cascade');

      table.specificType('id_account', 'serial').notNullable().comment('ID счета');

      table.primary(['id_project', 'id_account'], 'account_pk');

      table.integer('id_user').notNullable().index('account_id_user').comment('ID пользователя');

      table.foreign('id_user', 'account_2_user').references('id_user').inTable('core$.user').onDelete('cascade');

      table
        .specificType('id_account_type', 'smallint')

        .notNullable()
        .comment('ID типа счета');

      table
        .foreign('id_account_type', 'account_2_account_type')
        .references('id_account_type')
        .inTable('cf$.account_type');

      table.text('name').notNullable().comment('Наименование');

      table
        .boolean('is_enabled')
        .notNullable()
        .defaultTo(true)
        .comment('This flag controls the availability of the account');

      table.text('note').comment('Примечание');
    })
    .raw('CREATE UNIQUE INDEX account_id_project_name_u ON cf$.account  USING btree (id_project, (upper(name)));')
    .raw("alter table cf$.account add constraint account_name_is_empty CHECK (btrim(name) <> ''::text);")
    .raw('alter table cf$.account add constraint account_name_is_too_long CHECK (length(name) <= 100);')
    .raw(account_bi_trigger_v1.up);
  await knex.schema.raw(account_bud_check_permit_v1.up);
  await knex.schema.raw(account_bud_check_permit_trigger_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('DROP TRIGGER account_bud_check_permit on cf$.account');
  await knex.schema.raw(account_bud_check_permit_v1.down);

  await knex.schema.dropTable('cf$.account');

  await knex.schema.raw(account_bi_v1.down);
}
