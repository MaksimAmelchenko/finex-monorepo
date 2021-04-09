import * as Knex from 'knex';

import { signup_request_bi_v1 } from './core$/signup_request_bi.function/v1';
import { signup_request_bi_trigger_v1 } from './core$/signup_request_bi.trigger/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('core$').alterTable('signup_request', table => {
    table.uuid('id').unique();
    table.timestamps(true, true);
    table.dropColumn('id_signup_request');
  });

  await knex.raw(`
    update core$.signup_request 
       set id = uuid_generate_v4(), 
           created_at=dset, 
           updated_at = coalesce(dconfirm, dset);
  `);

  await knex.schema.withSchema('core$').alterTable('signup_request', table => {
    table.uuid('id').notNullable().alter();

    table.renameColumn('dconfirm', 'confirmed_at');
    table.dropColumn('dset');
  });

  await knex.raw(signup_request_bi_trigger_v1.down);
  await knex.raw(signup_request_bi_v1.down);

  // cf$.household_id_household_seq
  await knex.schema.raw('GRANT USAGE ON cf$.household_id_household_seq TO web');
  await knex.schema.raw('GRANT USAGE ON cf$.project_id_project_seq TO web');
  await knex.schema.raw('GRANT USAGE ON core$.user_id_user_seq TO web');
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(signup_request_bi_v1.up);
  await knex.raw(signup_request_bi_trigger_v1.up);

  await knex.schema.withSchema('core$').alterTable('signup_request', table => {
    table.dropColumn('id');
    table.renameColumn('confirmed_at', 'dconfirm');

    table.specificType('id_signup_request', 'serial').comment('ID запроса на регистрацию');
    table.timestamp('dset').comment('Дата регистрации');
  });

  await knex.raw(`
    update core$.signup_request 
       set id_signup_request = nextval('core$.signup_request_id_signup_request_seq'),
           dset = created_at
  `);

  await knex.schema.withSchema('core$').alterTable('signup_request', table => {
    table.primary(['id_signup_request'], 'signup_request_pk');
    table.dropTimestamps();
  });

  await knex.schema.raw('REVOKE USAGE ON cf$.household_id_household_seq FROM web');
  await knex.schema.raw('REVOKE USAGE ON cf$.project_id_project_seq FROM web');
  await knex.schema.raw('REVOKE USAGE ON core$.user_id_user_seq FROM web');
}
