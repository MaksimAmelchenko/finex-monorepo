import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('GRANT SELECT ON TABLE cf$.cashflow TO web');
  await knex.schema.raw('GRANT SELECT ON TABLE cf$.cashflow_detail TO web');
  await knex.schema.raw('GRANT SELECT ON TABLE cf$.account TO web');
  await knex.schema.raw('GRANT SELECT ON TABLE cf$.account_permit TO web');
  await knex.schema.raw('GRANT SELECT ON TABLE cf$.contractor TO web');
  await knex.schema.raw('GRANT SELECT ON TABLE cf$.category TO web');
  await knex.schema.raw('GRANT SELECT ON TABLE cf$.unit TO web');
  await knex.schema.raw('GRANT SELECT ON TABLE cf$.money TO web');
  await knex.schema.raw('GRANT SELECT ON TABLE cf$.currency TO web');
  await knex.schema.raw('GRANT SELECT ON TABLE cf$.tag TO web');
  await knex.schema.raw('GRANT USAGE ON SCHEMA "cf$_category" TO web');
  await knex.schema.raw('GRANT USAGE ON SCHEMA "cf$_account" TO web');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('REVOKE SELECT ON TABLE cf$.cashflow FROM web');
  await knex.schema.raw('REVOKE SELECT ON TABLE cf$.cashflow_detail FROM web');
  await knex.schema.raw('REVOKE SELECT ON TABLE cf$.account FROM web');
  await knex.schema.raw('REVOKE SELECT ON TABLE cf$.account_permit FROM web');
  await knex.schema.raw('REVOKE SELECT ON TABLE cf$.contractor FROM web');
  await knex.schema.raw('REVOKE SELECT ON TABLE cf$.category FROM web');
  await knex.schema.raw('REVOKE SELECT ON TABLE cf$.unit FROM web');
  await knex.schema.raw('REVOKE SELECT ON TABLE cf$.money FROM web');
  await knex.schema.raw('REVOKE SELECT ON TABLE cf$.currency FROM web');
  await knex.schema.raw('REVOKE SELECT ON TABLE cf$.tag FROM web');
  await knex.schema.raw('REVOKE USAGE ON SCHEMA "cf$_category" FROM web');
  await knex.schema.raw('REVOKE USAGE ON SCHEMA "cf$_account" FROM web');
}
