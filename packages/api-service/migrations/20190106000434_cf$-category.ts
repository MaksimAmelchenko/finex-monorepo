import { Knex } from 'knex';

import { category_bi_v1 } from './cf$/category_bi.function/v1';
import { category_bi_trigger_v1 } from './cf$/category_bi.trigger/v1';
import { v_category_v1 } from './cf$/v_category.view/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(category_bi_v1.up);

  await knex.schema
    .withSchema('cf$')
    .createTable('category', table => {
      table.comment('Статья денежного потока');

      table.integer('id_project').notNullable();
      table
        .foreign('id_project', 'category_2_project')
        .references('id_project')
        .inTable('cf$.project')
        .onDelete('cascade');

      table.specificType('id_category', 'serial').notNullable().comment('УИД статьи денежного потока');

      table.primary(['id_project', 'id_category'], 'category_pk');

      table.integer('id_user').notNullable().comment('УИД пользователя');

      // table
      //   .foreign('id_user', 'category_2_user')
      //   .references('id_user')
      //   .inTable('core$.user')
      //   .onDelete('cascade');

      table.integer('parent').comment('Ссылка на родительскую статью');

      table
        .foreign(['id_project', 'parent'], 'category_2_category_parent')
        .references(['id_project', 'id_category'])
        .inTable('cf$.category');

      table.integer('id_unit').comment('УИД ед.измерения по умолчанию');

      table.text('name').notNullable().comment('Наименование');

      table
        .boolean('is_enabled')
        .notNullable()
        .defaultTo(true)
        .comment('Видимость статьи при редикторовании транзакции');

      table.boolean('is_system').notNullable().defaultTo(false);

      table.text('note').comment('Примечание');

      table
        .integer('id_category_prototype')
        .comment(
          "Для представления некоторых статей как одна. Например есть категории ''Мой автомобиль'', ''Автомобиль жены''. Для них можно указать один прототоп ''Автомобиль''"
        );

      table
        .foreign('id_category_prototype', 'category_2_category_prototype')
        .references('id_category_prototype')
        .inTable('cf$.category_prototype');

      table.index(['id_project', 'parent'], 'category_parent');
      table.index(['id_project', 'id_category_prototype'], 'category_id_project_id_category_prototype');
    })
    .raw("alter table cf$.category add constraint category_name_is_empty CHECK (btrim(name) <> ''::text);")
    .raw('alter table cf$.category add constraint category_name_is_too_long CHECK (length(name) <= 100);')
    .raw('CREATE UNIQUE INDEX category_u ON cf$.category USING btree (id_project, (upper(name)), parent);')
    .raw(category_bi_trigger_v1.up);
  await knex.schema.raw(v_category_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(v_category_v1.down);
  await knex.schema.dropTable('cf$.category');
  await knex.schema.raw(category_bi_v1.down);
}
