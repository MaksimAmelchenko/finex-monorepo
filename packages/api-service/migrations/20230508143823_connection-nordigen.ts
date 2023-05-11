import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA cf$_nordigen');
  await knex.schema.raw('GRANT USAGE ON SCHEMA "cf$_nordigen" TO web');

  await knex.schema.withSchema('cf$_nordigen').createTable('requisition', table => {
    table.integer('project_id').notNullable();
    table.integer('user_id').notNullable();
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('requisition_id').notNullable();
    table.text('institution_id').notNullable();
    table.uuid('connection_id');
    table.text('status').comment("'CR' | 'GC' | 'UA' | 'RJ' | 'SA' | 'GA' | 'LN' | 'SU' | 'EX';");
    table.specificType('responses', 'jsonb[]').notNullable();
    table.timestamps(true, true);

    table.primary(['project_id', 'user_id', 'id'], { constraintName: 'requisition_pk' });

    table.foreign('user_id', 'requisition_x_user_fk').references('id_user').inTable('core$.user').onDelete('CASCADE');

    table
      .foreign('project_id', 'requisition_x_project_fk')
      .references('id_project')
      .inTable('cf$.project')
      .onDelete('CASCADE');

    table
      .foreign(['project_id', 'user_id', 'connection_id'], 'requisition_x_connection_fk')
      .references(['project_id', 'user_id', 'id'])
      .inTable('cf$_connection.connection')
      .onDelete('CASCADE');
  });

  await knex.schema.raw('GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE "cf$_nordigen".requisition TO web');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('DROP SCHEMA cf$_nordigen CASCADE');
}
