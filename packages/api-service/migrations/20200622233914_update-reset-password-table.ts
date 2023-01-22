import { Knex } from 'knex';
import { password_recovery_request_bi_trigger_v1 } from './core$/password_recovery_request_bi.trigger/v1';
import { password_recovery_request_bi_v1 } from './core$/password_recovery_request_bi.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('core$').alterTable('password_recovery_request', table => {
    table.uuid('id').unique();
    table.timestamps(true, true);

    table.dropColumn('id_password_recovery_request');
  });

  await knex.raw(`
    update core$.password_recovery_request set id = uuid_generate_v4(), created_at=dset, updated_at = coalesce(drecovery, dset);
  `);

  await knex.schema.withSchema('core$').alterTable('password_recovery_request', table => {
    table.uuid('id').notNullable().alter();

    table.renameColumn('drecovery', 'reset_at');
    table.dropColumn('dset');
  });

  await knex.raw(password_recovery_request_bi_trigger_v1.down);
  await knex.raw(password_recovery_request_bi_v1.down);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(password_recovery_request_bi_v1.up);
  await knex.raw(password_recovery_request_bi_trigger_v1.up);

  await knex.schema.withSchema('core$').alterTable('password_recovery_request', table => {
    table.dropColumn('id');
    table.renameColumn('reset_at', 'drecovery');

    table.specificType('id_password_recovery_request', 'serial');
    table.timestamp('dset');
  });

  await knex.raw('update core$.password_recovery_request set dset = created_at');

  await knex.raw(`
    update core$.password_recovery_request set id_password_recovery_request = nextval('core$.password_recovery_request_id_password_recovery_request_seq');
  `);

  await knex.schema.withSchema('core$').alterTable('password_recovery_request', table => {
    table.primary(['id_password_recovery_request'], { constraintName: 'password_recovery_request_pk' });
    table.dropTimestamps();
  });
}
