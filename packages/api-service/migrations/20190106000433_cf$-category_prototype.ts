import { Knex } from 'knex';

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

  await knex.schema.raw(`
        insert
          into cf$.category_prototype ( id_category_prototype, parent, name, is_enabled, is_system )
        values ( 1, null, 'Долг', true, true ),
               ( 2, 1, 'Основная сумма', true, true ),
               ( 3, 1, 'Возврат основной суммы', true, true ),
               ( 4, 1, 'Проценты', true, true ),
               ( 5, 1, 'Штраф / пеня', true, true ),
               ( 6, 1, 'Комиссия', true, true ),
               ( 10, null, 'Перемещение', true, true ),
               ( 11, 10, 'Основная сумма', true, true ),
               ( 12, 10, 'Комиссия', true, true ),
               ( 20, null, 'Конвертация валюты', true, true ),
               ( 22, 20, 'Комиссия', true, true ),
               ( 30, null, 'Продукты', true, false ),
               ( 50, null, 'Автомобиль', true, false ),
               ( 51, 50, 'Бензин', true, false ),
               ( 52, 50, 'Шиномонтаж', true, false ),
               ( 53, 50, 'Мойка', true, false ),
               ( 54, 50, 'Тех.осмотр', true, false ),
               ( 55, 50, 'Сервис', true, false ),
               ( 56, 50, 'Страховка', true, false ),
               ( 57, 50, 'Аренда', true, false ),
               ( 60, null, 'Образование', true, false ),
               ( 61, 60, 'Книги', true, false ),
               ( 70, null, 'Развлечения', true, false ),
               ( 80, null, 'Отдых', true, false ),
               ( 90, null, 'Квартира / Дом', true, false ),
               ( 91, 90, 'Ремонт', true, false ),
               ( 92, 90, 'Коммунальные услуги', true, false ),
               ( 93, 90, 'Аренда', true, false ),
               ( 94, 90, 'Страхование', true, false ),
               ( 100, null, 'Мебель', true, false ),
               ( 110, null, 'Здоровье', true, false ),
               ( 111, 110, 'Лекарства', true, false ),
               ( 112, 110, 'Прием врача', true, false ),
               ( 113, 110, 'Обследование', true, false ),
               ( 114, 110, 'Страхование', true, false ),
               ( 120, null, 'Электроника и бытовая техника', true, false ),
               ( 130, null, 'Хоз. товары', true, false ),
               ( 140, null, 'Одежда', true, false ),
               ( 150, null, 'Подарки', true, false ),
               ( 160, null, 'Проезд', true, false ),
               ( 170, null, 'Связь', true, false ),
               ( 171, 170, 'Телефон', true, false ),
               ( 172, 170, 'Интернет', true, false ),
               ( 173, 170, 'Телевидение', true, false ),
               ( 180, null, 'Курение', true, false ),
               ( 190, null, 'Спиртные напитки', true, false ),
               ( 210, null, 'Без категории', true, false ),
               ( 300, null, 'Зарплата', true, false ),
               ( 21, 20, 'Основная сумма', true, true ),
               ( 200, null, 'Выравнивание остатка', true, false );
    `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('cf$.category_prototype');
}
