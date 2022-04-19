import { Knex } from 'knex';

import { server_init_v1 } from './core$/server_init.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('core$').createTable('server', table => {
    table.integer('nnode');
  });

  await knex.schema.raw(server_init_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('core$.server');
  await knex.schema.raw(server_init_v1.down);
}
