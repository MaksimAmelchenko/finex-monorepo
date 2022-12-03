import { Knex } from 'knex';

import { project_permit_aiud_check_permit_v1 } from './cf$/project_permit_aiud_check_permit.function/v1';
import { project_permit_aiud_check_permit_trigger_v1 } from './cf$/project_permit_aiud_check_permit.trigger/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(project_permit_aiud_check_permit_v1.up);

  await knex.schema
    .withSchema('cf$')
    .createTable('project_permit', table => {
      table.comment('Разрешение на проект для конкретного пользователя');

      table.integer('id_project').notNullable().comment('УИД проекта').index('project_permit_id_project');

      table
        .foreign('id_project', 'project_permit_2_project')
        .references('id_project')
        .inTable('cf$.project')
        .onDelete('cascade');

      table.integer('id_user').notNullable().comment('Пользователь, которому дают право');

      table.foreign('id_user', 'project_permit_2_user').references('id_user').inTable('core$.user').onDelete('cascade');

      table
        .specificType('permit', 'smallint')
        .notNullable()
        .comment('3 - чтение и запись в проект (нет прав на передачу прав)');

      table.unique(['id_user', 'id_project'], { indexName: 'project_permit_id_user_project_u' });
    })
    .raw(project_permit_aiud_check_permit_trigger_v1.up);

  await knex.schema.raw('GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE "cf$".project_permit TO web;');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('cf$.project_permit');

  await knex.schema.raw(project_permit_aiud_check_permit_v1.down);
}
