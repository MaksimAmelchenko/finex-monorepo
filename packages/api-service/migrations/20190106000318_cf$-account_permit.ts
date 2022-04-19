import { Knex } from 'knex';

import { account_permit_biud_check_permit_v1 } from './cf$/account_permit_biud_check_permit.function/v1';
import { account_permit_biud_trigger_v1 } from './cf$/account_permit_biud.trigger/v1';
import { v_account_permit_v1 } from './cf$/v_account_permit.view/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(account_permit_biud_check_permit_v1.up);

  await knex.schema
    .withSchema('cf$')
    .createTable('account_permit', table => {
      table.comment('Право доступа к счету');

      table.integer('id_project').notNullable().comment('ID проекта');

      // table
      //   .foreign('id_project', 'account_permit_2_project')
      //   .references('id_project')
      //   .inTable('cf$.project')
      //   .onDelete('cascade');

      table.integer('id_account').notNullable().index('account_permit_id_account').comment('ID счета');

      table
        .foreign(['id_project', 'id_account'], 'account_permit_2_account')
        .references(['id_project', 'id_account'])
        .inTable('cf$.account')
        .onDelete('cascade');

      table
        .integer('id_user')
        .notNullable()
        .index('account_permit_id_user')
        .comment('ID пользователя, у которого есть право');

      table.foreign('id_user', 'account_permit_2_user').references('id_user').inTable('core$.user').onDelete('cascade');

      table
        .specificType('permit', 'smallint')

        .notNullable()
        .comment('1 - чтение, 3 - чтение и запись, 7 - владелец счета');
      table.unique(['id_project', 'id_account', 'id_user'], 'account_permit_id_project_id_account_id_user_u');
    })
    .raw(account_permit_biud_trigger_v1.up);
  await knex.schema.raw(v_account_permit_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(v_account_permit_v1.down);
  await knex.schema.dropTable('cf$.account_permit');
  await knex.schema.raw(account_permit_biud_check_permit_v1.down);
}
