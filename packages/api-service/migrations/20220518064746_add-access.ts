import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('GRANT SELECT ON TABLE cf$.category_prototype TO web');
  await knex.schema.raw('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE cf$.contractor TO web');
  await knex.schema.raw('GRANT USAGE, SELECT ON SEQUENCE cf$.contractor_id_contractor_seq TO web');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('REVOKE SELECT ON TABLE cf$.category_prototype from web');
  await knex.schema.raw('REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLE cf$.contractor from web');
  await knex.schema.raw('REVOKE USAGE, SELECT ON SEQUENCE cf$.contractor_id_contractor_seq FROM web');
}
