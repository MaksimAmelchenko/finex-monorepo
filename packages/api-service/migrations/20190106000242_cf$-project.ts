import { Knex } from 'knex';

import { project_bi_v1 } from './cf$/project_bi.function/v1';
import { project_bi_trigger_v1 } from './cf$/project_bi.trigger/v1';
import { project_bud_check_permit_v1 } from './cf$/project_bud_check_permit.function/v1';
import { project_bud_check_permit_trigger_v1 } from './cf$/project_bud_check_permit.trigger/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(project_bi_v1.up);

  await knex.schema
    .withSchema('cf$')
    .createTable('project', table => {
      table.specificType('id_project', 'serial').notNullable().primary('project_pk').comment('Project ID');

      table.integer('id_user').notNullable().comment('Owner ID');

      table.foreign('id_user', 'project_2_user').references('id_user').inTable('core$.user').onDelete('cascade');

      table.text('name').notNullable();
      table.text('note');
    })
    .raw("alter table cf$.project add constraint project_name_is_empty CHECK (btrim(name) <> ''::text);")
    .raw('alter table cf$.project add constraint project_name_is_too_long CHECK (length(name) <= 30);')
    .raw('CREATE UNIQUE INDEX project_id_user_name_u ON cf$.project  USING btree (id_user, (upper(name)));')

    .raw(project_bi_trigger_v1.up);
  await knex.schema.raw(project_bud_check_permit_v1.up);
  await knex.schema.raw(project_bud_check_permit_trigger_v1.up);

  await knex.schema.raw('GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE "cf$".project TO web;');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('DROP TRIGGER project_bud_check_permit on cf$.project');
  await knex.schema.raw(project_bud_check_permit_v1.down);

  await knex.schema.dropTable('cf$.project');
  await knex.schema.raw(project_bi_v1.down);
}
