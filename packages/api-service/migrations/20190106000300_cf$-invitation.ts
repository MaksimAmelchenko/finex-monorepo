import { Knex } from 'knex';

import { invitation_bi_v1 } from './cf$/invitation_bi.function/v1';
import { invitation_bi_trigger_v1 } from './cf$/invitation_bi.trigger/v1';
import { v_invitation_v1 } from './cf$/v_invitation.view/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(invitation_bi_v1.up);

  await knex.schema
    .withSchema('cf$')
    .createTable('invitation', table => {
      table.comment('Приглашение');

      table.specificType('id_invitation', 'serial').notNullable().unique('invitation_id_invitation');

      table.integer('id_user_host').notNullable().comment('УИД пользователя - приглашающего');

      table.integer('id_user_guest').notNullable().comment('УИД пользователя - приглашаемого');

      table.text('email_host').comment('E-Mail приглашающего');

      table.text('message').comment('Сообщение');

      table.timestamp('dset').comment('Дата приглашения');

      table.index(['id_user_guest'], 'invitation_id_user_guest');
    })
    .raw(invitation_bi_trigger_v1.up);
  await knex.schema.raw(v_invitation_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(v_invitation_v1.down);
  await knex.schema.dropTable('cf$.invitation');

  await knex.schema.raw(invitation_bi_v1.down);
}
