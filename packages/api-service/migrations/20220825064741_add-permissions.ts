import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('GRANT USAGE, SELECT ON SEQUENCE cf$.cashflow_id_cashflow_seq TO web');
  await knex.schema.raw('GRANT USAGE, SELECT ON SEQUENCE cf$.cashflow_detail_id_cashflow_detail_seq TO web');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('REVOKE USAGE, SELECT ON SEQUENCE cf$.cashflow_id_cashflow_seq FROM web');
  await knex.schema.raw('REVOKE USAGE, SELECT ON SEQUENCE cf$.cashflow_detail_id_cashflow_detail_seq FROM web');
}
