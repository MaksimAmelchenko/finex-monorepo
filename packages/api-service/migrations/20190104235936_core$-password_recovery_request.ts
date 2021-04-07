import * as Knex from 'knex';

import { password_recovery_request_bi_v1 } from './core$/password_recovery_request_bi.function/v1';
import { password_recovery_request_bi_trigger_v1 } from './core$/password_recovery_request_bi.trigger/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(password_recovery_request_bi_v1.up);

  await knex.schema
    .withSchema('core$')
    .createTable('password_recovery_request', table => {
      table.specificType('id_password_recovery_request', 'serial').primary('password_recovery_request_pk');
      table.text('email');

      table.text('token').unique('password_recovery_request_token');

      table.timestamp('dset');
      table.timestamp('drecovery');
      table.specificType('ip', 'inet');
    })
    .raw(password_recovery_request_bi_trigger_v1.up);

  await knex.schema.raw('GRANT INSERT, SELECT, UPDATE ON TABLE "core$".password_recovery_request TO web;');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('core$.password_recovery_request');
  await knex.schema.raw(password_recovery_request_bi_v1.down);
}
