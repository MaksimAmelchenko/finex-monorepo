import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('core$').createTable('update_log', table => {
    table.comment('История применения обновлений');

    table.text('label').comment('Метка обновления');

    table.timestamp('dset').defaultTo(knex.raw('clock_timestamp()'));
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('core$.update_log');
}
