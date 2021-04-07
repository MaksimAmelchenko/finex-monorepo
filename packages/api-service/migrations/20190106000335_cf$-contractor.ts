import * as Knex from 'knex';

import { contractor_bi_v1 } from './cf$/contractor_bi.function/v1';
import { contractor_bi_trigger_v1 } from './cf$/contractor_bi.trigger/v1';
import { v_contractor_v1 } from './cf$/v_contractor.view/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(contractor_bi_v1.up);

  await knex.schema
    .withSchema('cf$')
    .createTable('contractor', table => {
      table.comment('Контрагент');

      table.integer('id_project').notNullable();
      table
        .foreign('id_project', 'contractor_2_project')
        .references('id_project')
        .inTable('cf$.project')
        .onDelete('cascade');

      table.specificType('id_contractor', 'serial').notNullable().comment('ID контрагента');

      table.integer('id_user').notNullable().comment('ID пользователя');

      table.foreign('id_user', 'contractor_2_user').references('id_user').inTable('core$.user').onDelete('cascade');

      table.text('name').notNullable().comment('Наименование');

      table.text('note');

      table.primary(['id_project', 'id_contractor'], 'contractor_pk');
    })
    .raw("alter table cf$.contractor add constraint contractor_name_is_empty CHECK (btrim(name) <> ''::text);")
    .raw('alter table cf$.contractor add constraint contractor_name_is_too_long CHECK (length(name) <= 100);')
    .raw('CREATE UNIQUE INDEX contractor_id_project_name_u ON cf$.contractor USING btree (id_project, (upper(name)));')
    .raw(contractor_bi_trigger_v1.up);
  await knex.schema.raw(v_contractor_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(v_contractor_v1.down);
  await knex.schema.dropTable('cf$.contractor');
  await knex.schema.raw(contractor_bi_v1.down);
}
