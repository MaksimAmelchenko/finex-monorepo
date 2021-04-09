import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.schema.withSchema('core$').createTable('transactional_email', table => {
    table.comment('Journal of sending of transactional emails');

    table.text('email').notNullable().index();
    table.text('message').notNullable();

    table.timestamps(true, true);
  });

  await knex.schema.raw('GRANT INSERT, SELECT ON TABLE "core$".transactional_email TO web;');
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTable('core$.transactional_email');
}
