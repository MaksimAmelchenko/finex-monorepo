import * as Knex from 'knex';

import { v_import_source_v1 } from './cf$/v_import_source.view/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('cf$').createTable('import_source', table => {
    table.comment('Источник иморта (Какая-то программа, банковская выписка и т.д.)');

    table.integer('id_import_source').notNullable().primary('import_source_pk').comment('УИД источника импорта');

    table.text('name').notNullable().comment('Наименование');
    table.text('note').comment('Примечание');
  });
  await knex.schema.raw(v_import_source_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(v_import_source_v1.down);
  await knex.schema.dropTable('cf$.import_source');
}
