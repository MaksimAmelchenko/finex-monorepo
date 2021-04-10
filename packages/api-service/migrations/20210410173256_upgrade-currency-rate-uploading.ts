import * as Knex from 'knex';

import { currency_rate_pending_v1 } from './job$/currency_rate_pending.view/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('GRANT USAGE ON SCHEMA "cf$_currency" TO web');

  await knex.schema.raw('REVOKE SELECT ON TABLE "job$".currency_rate_pending from job');
  await knex.schema.raw('REVOKE USAGE ON SCHEMA "job$" from job');
  await knex.schema.raw('REVOKE USAGE ON SCHEMA "cf$_currency" from job');
  await knex.schema.raw(
    'REVOKE ALL ON FUNCTION "cf$_currency".upload_openexchangerates(iparams jsonb, OUT oresult text) from job'
  );

  await knex.schema.raw('drop role job');
  await knex.schema.raw(currency_rate_pending_v1.down);
  await knex.schema.raw('DROP SCHEMA job$');
}

export async function down(knex: Knex): Promise<void> {}
