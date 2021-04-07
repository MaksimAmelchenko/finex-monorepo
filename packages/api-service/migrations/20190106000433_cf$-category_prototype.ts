import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('cf$').createTable('category_prototype', table => {
    table.comment(
      'Прототип категории. "Идеальная" структура категорий. Используются для первоначального заполнения справочника категорий. Может быть основой для построения общий отчетов по всем пользователям.'
    );

    table.integer('id_category_prototype').notNullable().primary('category_prototype_pk').comment('ID прототипа');

    table.integer('parent').comment('ID родительской категории');

    table
      .foreign('parent', 'category_prototype_2_category_prototype_parent')
      .references('id_category_prototype')
      .inTable('cf$.category_prototype');

    table.text('name').notNullable().comment('Наименование');

    table.boolean('is_enabled').notNullable().comment('Флаг "Активная"');

    table.boolean('is_system').notNullable().comment('Флаг "Системная"');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('cf$.category_prototype');
}
