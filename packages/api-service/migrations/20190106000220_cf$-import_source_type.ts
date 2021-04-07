import * as Knex from 'knex';

import { v_import_source_type_v1 } from './cf$/v_import_source_type.view/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('cf$').createTable('import_source_type', table => {
    table.comment(
      'Формат данных конкретного источника импорта. (У одной программы может быть несколько файлов-выгрузок (Доходы, расходы, счета и т.д.)'
    );

    table.integer('id_import_source').notNullable().comment('УИД источника импорта');

    table
      .foreign('id_import_source', 'import_source_type_2_import_source')
      .references('id_import_source')
      .inTable('cf$.import_source')
      .onDelete('cascade');

    table.integer('code').notNullable().comment('Код формата импортируемых данных');

    table.primary(['id_import_source', 'code'], 'import_source_type_pk');

    table.text('name').notNullable().comment('Наименование');

    table.text('note').comment('html-текс примечания');

    table.text('help').comment('html-текст помощи');

    table.specificType('sorting', 'smallint').comment('Сортировка');

    table.boolean('is_enabled').defaultTo(true).notNullable();

    table.text('delimiter');
  });
  await knex.schema.raw(v_import_source_type_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(v_import_source_type_v1.down);
  await knex.schema.dropTable('cf$.import_source_type');
}
