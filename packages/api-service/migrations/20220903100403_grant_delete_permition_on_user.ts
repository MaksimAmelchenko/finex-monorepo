import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('GRANT DELETE ON TABLE core$.user TO web');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('REVOKE DELETE ON TABLE core$.user FROM web');
}
