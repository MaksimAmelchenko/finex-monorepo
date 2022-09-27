import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('GRANT USAGE, SELECT ON SEQUENCE cf$.plan_id_plan_seq TO web');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('REVOKE USAGE, SELECT ON SEQUENCE cf$.plan_id_plan_seq FROM web');
}
