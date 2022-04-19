import { Knex } from 'knex';

import { currency_rate_pending_v1 } from './job$/currency_rate_pending.view/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA job$;');
  await knex.schema.raw('REVOKE ALL ON SCHEMA "job$" FROM PUBLIC;');

  await knex.schema.raw(currency_rate_pending_v1.up);
  await knex.schema.raw('GRANT USAGE ON SCHEMA "job$" TO job;');
  await knex.schema.raw('GRANT SELECT ON TABLE "job$".currency_rate_pending TO job;');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(currency_rate_pending_v1.down);

  await knex.schema.raw('DROP SCHEMA job$;');
}
