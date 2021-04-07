import * as Knex from 'knex';

import { unit_bi_v1 } from './cf$/unit_bi.function/v1';
import { unit_bi_trigger_v1 } from './cf$/unit_bi.trigger/v1';
import { v_unit_v1 } from './cf$/v_unit.view/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(unit_bi_v1.up);

  await knex.schema
    .withSchema('cf$')
    .createTable('unit', table => {
      table.comment('Единица измерения');

      table.integer('id_project').notNullable().comment('ID проекта');

      table.foreign('id_project', 'unit_2_project').references('id_project').inTable('cf$.project').onDelete('cascade');

      table.specificType('id_unit', 'serial').notNullable().comment('ID ед.измерения');

      table.integer('id_user').notNullable().comment('ID пользователя');

      table.foreign('id_user', 'unit_2_user').references('id_user').inTable('core$.user').onDelete('cascade');

      table.text('name').notNullable().comment('Наименование');

      table.primary(['id_project', 'id_unit'], 'unit_pk');
    })
    .raw("alter table cf$.unit add constraint unit_name_is_empty CHECK (btrim(name) <> ''::text);")
    .raw('alter table cf$.unit add constraint unit_name_is_too_long CHECK (length(name) <= 20);')
    .raw('CREATE UNIQUE INDEX unit_id_project_name_u ON cf$.unit USING btree (id_project, (upper(name)));')
    .raw(unit_bi_trigger_v1.up);
  await knex.schema.raw(v_unit_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(v_unit_v1.down);
  await knex.schema.dropTable('cf$.unit');
  await knex.schema.raw(unit_bi_v1.down);
}
