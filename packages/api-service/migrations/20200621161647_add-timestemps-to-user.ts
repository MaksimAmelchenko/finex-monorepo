import { Knex } from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.schema.withSchema('core$').alterTable('user', table => {
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.withSchema('core$').alterTable('user', table => {
    table.dropTimestamps();
  });
}
