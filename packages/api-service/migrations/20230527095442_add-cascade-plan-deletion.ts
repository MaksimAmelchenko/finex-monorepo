import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('cf$').alterTable('plan', table => {
    table.foreign('id_user', 'plan_2_user').references('id_user').inTable('core$.user').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('cf$').alterTable('plan', table => {
    table.dropForeign('id_user', 'plan_2_user');
  });
}
