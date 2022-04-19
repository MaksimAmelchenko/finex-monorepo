import { Knex } from 'knex';

import { tag_bi_v1 } from './cf$/tag_bi.function/v1';
import { tag_bi_trigger_v1 } from './cf$/tag_bi.trigger/v1';
import { v_tag_v1 } from './cf$/v_tag.view/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(tag_bi_v1.up);

  await knex.schema
    .withSchema('cf$')
    .createTable('tag', table => {
      table.comment('Тег');

      table.integer('id_project').notNullable();
      table.foreign('id_project', 'tag_2_project').references('id_project').inTable('cf$.project').onDelete('cascade');

      table.specificType('id_tag', 'serial').notNullable().primary('tag_pk');

      table.integer('id_user').notNullable();
      table.foreign('id_user', 'tag_2_user').references('id_user').inTable('core$.user').onDelete('cascade');

      table.text('name').notNullable();
    })
    .raw("alter table cf$.tag add constraint tag_name_is_empty CHECK (btrim(name) <> ''::text);")
    .raw('alter table cf$.tag add constraint tag_name_is_too_long CHECK (length(name) <= 30);')
    .raw('CREATE UNIQUE INDEX tag_id_project_name_u ON cf$.tag USING btree (id_project, (upper(name)));')
    .raw(tag_bi_trigger_v1.up);
  await knex.schema.raw(v_tag_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(v_tag_v1.down);
  await knex.schema.dropTable('cf$.tag');
  await knex.schema.raw(tag_bi_v1.down);
}
