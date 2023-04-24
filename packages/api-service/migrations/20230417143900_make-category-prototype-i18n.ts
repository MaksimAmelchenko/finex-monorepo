import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('cf$').alterTable('category_prototype', table => {
    table.specificType('name_new', 'jsonb');
  });

  await knex.raw(`
    update cf$.category_prototype
       set name_new = jsonb_build_object('ru',
                                         case
                                           when id_category_prototype = 10 then 'Перевод'
                                           when id_category_prototype = 20 then 'Обмен валюты'
                                           when id_category_prototype = 30 then 'Еда и продукты'
                                           when id_category_prototype = 51
                                             then 'Бензин и техническое обслуживание автомобиля'
                                           when id_category_prototype = 56 then 'Страхование и налоги на транспорт'
                                           when id_category_prototype = 61 then 'Книги и учебные материалы'
                                           when id_category_prototype = 70 then 'Отдых и развлечения'
                                           when id_category_prototype = 110 then 'Здоровье и красота'
                                           when id_category_prototype = 111 then 'Медицинские услуги и лекарства'
                                           when id_category_prototype = 140 then 'Одежда и обувь'
                                           when id_category_prototype = 170 then 'Мобильная связь, Интернет и ТВ'
                                           when id_category_prototype = 200 then 'Корректировка'
                                           when id_category_prototype = 210 then 'Разное'
                                           else name
                                           end,
                                         'en',
                                         case
                                           when id_category_prototype = 1 then 'Debt'
                                           when id_category_prototype = 2 then 'Principal amount'
                                           when id_category_prototype = 3 then 'Principal repayment'
                                           when id_category_prototype = 4 then 'Paid Interest'
                                           when id_category_prototype = 5 then 'Fine'
                                           when id_category_prototype = 6 then 'Fee'
                                           when id_category_prototype = 10 then 'Transfer'
                                           when id_category_prototype = 11 then 'Principal amount'
                                           when id_category_prototype = 12 then 'Fee'
                                           when id_category_prototype = 20 then 'Exchange'
                                           when id_category_prototype = 21 then 'Principal amount'
                                           when id_category_prototype = 22 then 'Fee'
                                           when id_category_prototype = 30 then 'Food & Groceries'
                                           when id_category_prototype = 50 then 'Transport'
                                           when id_category_prototype = 51 then 'Gasoline & Car maintenance'
                                           when id_category_prototype = 56 then 'Insurance & Car tax'
                                           when id_category_prototype = 60 then 'Education'
                                           when id_category_prototype = 61 then 'Books and study materials'
                                           when id_category_prototype = 70 then 'Leisure & Entertainment'
                                           when id_category_prototype = 90 then 'Household & Utilities'
                                           when id_category_prototype = 91 then 'Construction and repair'
                                           when id_category_prototype = 92 then 'Utilities'
                                           when id_category_prototype = 93 then 'Rent'
                                           when id_category_prototype = 110 then 'Health & Beauty'
                                           when id_category_prototype = 111 then 'Medical services and drugs'
                                           when id_category_prototype = 120 then 'Media & Electronics'
                                           when id_category_prototype = 130 then 'Household products'
                                           when id_category_prototype = 140 then 'Shopping'
                                           when id_category_prototype = 170 then 'Mobile, Internet & TV'
                                           when id_category_prototype = 200 then 'Correction'
                                           when id_category_prototype = 210 then 'Miscellaneous'
                                           else name
                                           end,
                                         'de',
                                         case
                                           when id_category_prototype = 1 then 'Schulden'
                                           when id_category_prototype = 2 then 'Hauptbetrag'
                                           when id_category_prototype = 3 then 'Tilgung des Hauptbetrags'
                                           when id_category_prototype = 4 then 'Gezahlte Zinsen'
                                           when id_category_prototype = 5 then 'Strafe'
                                           when id_category_prototype = 6 then 'Gebühr'
                                           when id_category_prototype = 10 then 'Überweisung'
                                           when id_category_prototype = 11 then 'Hauptbetrag'
                                           when id_category_prototype = 12 then 'Gebühr'
                                           when id_category_prototype = 20 then 'Wechsel'
                                           when id_category_prototype = 21 then 'Hauptbetrag'
                                           when id_category_prototype = 22 then 'Gebühr'
                                           when id_category_prototype = 30 then 'Lebensmittel & Einkäufe'
                                           when id_category_prototype = 50 then 'Verkehr'
                                           when id_category_prototype = 51 then 'Benzin & Auto-Unterhalt'
                                           when id_category_prototype = 56 then 'Versicherung & Kfz-Steuer'
                                           when id_category_prototype = 60 then 'Bildung'
                                           when id_category_prototype = 61 then 'Bücher & Lernmaterialien'
                                           when id_category_prototype = 70 then 'Freizeit & Unterhaltung'
                                           when id_category_prototype = 90 then 'Haushalt & Nebenkosten'
                                           when id_category_prototype = 91 then 'Bau & Reparatur'
                                           when id_category_prototype = 92 then 'Nebenkosten'
                                           when id_category_prototype = 93 then 'Miete'
                                           when id_category_prototype = 110 then 'Gesundheit & Schönheit'
                                           when id_category_prototype = 111 then 'Med. Dienstleistungen & Medikamente'
                                           when id_category_prototype = 120 then 'Medien & Elektronik'
                                           when id_category_prototype = 130 then 'Haushaltsprodukte'
                                           when id_category_prototype = 140 then 'Einkaufen'
                                           when id_category_prototype = 170 then 'Mobilfunk, Internet & TV'
                                           when id_category_prototype = 200 then 'Korrektur'
                                           when id_category_prototype = 210 then 'Sonstiges'
                                           else name
                                           end)
  `);

  await knex.schema.withSchema('cf$').alterTable('category_prototype', table => {
    table.dropColumn('name');
    table.renameColumn('name_new', 'name');
  });

  await knex.raw(`
    insert
      into cf$.category_prototype ( id_category_prototype, parent, name, is_enabled, is_system )
    values ( 58, 50, jsonb_build_object('en', 'Public transport',
                                        'de', 'Öffentlicher Verkehr',
                                        'ru', 'Общественный транспорт'), true, false ),
           ( 59, 50, jsonb_build_object('en', 'Taxi and car sharing',
                                        'de', 'Taxi & Carsharing',
                                        'ru', 'Такси и каршеринг'), true, false ),
           ( 62, 60, jsonb_build_object('en', 'Courses and trainings',
                                        'de', 'Kurse & Trainings',
                                        'ru', 'Курсы и тренинги'), true, false ),
           ( 63, 60, jsonb_build_object('en', 'Seminars and conferences',
                                        'de', 'Seminare & Konferenzen',
                                        'ru', 'Семинары и конференции'), true, false ),
           ( 71, 70, jsonb_build_object('ru', 'Кафе и рестораны',
                                        'en', 'Cafe & Restaurants',
                                        'de', 'Cafés & Restaurants'), true, false ),
           ( 72, 70, jsonb_build_object('ru', 'Путешествия и отпуск',
                                        'en', 'Travel & Holidays',
                                        'de', 'Reisen & Urlaub'), true, false ),
           ( 115, 110, jsonb_build_object('en', 'Sport & Fitness',
                                          'de', 'Sport & Fitness',
                                          'ru', 'Спорт и фитнес'), true, false ),
           ( 116, 110, jsonb_build_object('en', 'Cosmetics and hygiene products',
                                          'de', 'Kosmetik & Hygieneartikel',
                                          'ru', 'Косметика и гигиенические товары'), true, false ),
           ( 117, 110, jsonb_build_object('en', 'Dentistry',
                                          'de', 'Zahnmedizin',
                                          'ru', 'Стоматология'), true, false ),
           ( 410, null, jsonb_build_object('en', 'Family & Friends',
                                           'de', 'Familie & Freunde',
                                           'ru', 'Семья и друзья'), true, false ),
           ( 411, 410, jsonb_build_object('en', 'Gifts and holidays',
                                          'de', 'Geschenke & Feiertage',
                                          'ru', 'Подарки и праздники'), true, false ),
           ( 412, 410, jsonb_build_object('en', 'Children''s goods',
                                          'de', 'Waren für Kinder',
                                          'ru', 'Детские товары'), true, false ),
           ( 413, 410, jsonb_build_object('en', 'Caring for relatives',
                                          'de', 'Pflege v. Angehörigen',
                                          'ru', 'Уход за родственниками'), true, false ),
           ( 420, null, jsonb_build_object('en', 'Income',
                                           'de', 'Einkommen',
                                           'ru', 'Доход'), true, false ),
           ( 421, 420, jsonb_build_object('en', 'Salary',
                                          'de', 'Gehalt',
                                          'ru', 'Зарплата'), true, false ),
           ( 422, 420, jsonb_build_object('en', 'Bonuses',
                                          'de', 'Prämien & Boni',
                                          'ru', 'Премии и бонусы'), true, false ),
           ( 423, 420, jsonb_build_object('en', 'Cashback', 'de', 'Rückzahlung', 'ru', 'Кэшбэк'), true, false ),
           ( 424, 420, jsonb_build_object('en', 'Allowance', 'de', 'Zulage', 'ru', 'Пособие'), true, false ),
           ( 425, 420, jsonb_build_object('en', 'Child allowance',
                                          'de', 'Kindergeld',
                                          'ru', 'Детское пособие'), true, false ),
           ( 426, 420, jsonb_build_object('en', 'Pension', 'de', 'Rente', 'ru', 'Пенсия'), true, false ),
           ( 430, null, jsonb_build_object('en', 'Insurances & Finances',
                                           'de', 'Versicherungen & Finanzen',
                                           'ru', 'Страхование и финансы'), true, false ),
           ( 450, null, jsonb_build_object('en', 'Savings & Investments',
                                           'de', 'Sparen & Investieren',
                                           'ru', 'Сбережения и инвестиции'), true, false ),
           ( 460, null, jsonb_build_object('en', 'Tax & Fines',
                                           'de', 'Steuer & Strafen',
                                           'ru', 'Налоги и штрафы'), true, false ),
           ( 470, null, jsonb_build_object('en', 'Donations',
                                           'de', 'Spenden',
                                           'ru', 'Благотворительность'), true, false ),
           ( 480, null, jsonb_build_object('en', 'Pets',
                                           'de', 'Haustiere',
                                           'ru', 'Домашние животные'), true, false ),
           ( 490, null, jsonb_build_object('en', 'Hobbies and interests',
                                           'de', 'Hobbys & Interessen',
                                           'ru', 'Хобби и интересы'), true, false )
  `);

  await knex.raw(`
    update cf$.category
       set id_category_prototype = 50
     where id_category_prototype in (52, 53, 54, 55, 57)
  `);

  await knex.raw(`
    update cf$.category
       set id_category_prototype = 430
     where id_category_prototype = 94
  `);

  await knex.raw(`
    update cf$.category
       set id_category_prototype = 72
     where id_category_prototype = 80
  `);

  await knex.raw(`
    update cf$.category
       set id_category_prototype = 90
     where id_category_prototype = 100
  `);

  await knex.raw(`
    update cf$.category
       set id_category_prototype = 110
     where id_category_prototype between 112 and 114
  `);

  await knex.raw(`
    update cf$.category
       set id_category_prototype = 411
     where id_category_prototype = 150
  `);

  await knex.raw(`
    update cf$.category
       set id_category_prototype = 50
     where id_category_prototype = 160
  `);

  await knex.raw(`
    update cf$.category
       set id_category_prototype = 170
     where id_category_prototype between 171 and 173
  `);

  await knex.raw(`
    update cf$.category
       set id_category_prototype = 70
     where id_category_prototype in (180, 190)
  `);

  await knex.raw(`
    update cf$.category
       set id_category_prototype = 421
     where id_category_prototype = 300
  `);

  await knex.raw(`
    delete
      from cf$.category_prototype
     where id_category_prototype in
           (52, 53, 54, 55, 57, 80, 94, 100, 112, 113, 114, 150, 160, 171, 172, 173, 180, 190, 300)
  `);

  const {
    rows: [count],
  } = await knex.raw(`
    select count(*)::int as count
      from cf$.category c
             left join cf$.category_prototype cp
                       on c.id_category_prototype = cp.id_category_prototype
     where cp.id_category_prototype is null
       and c.id_category_prototype is not null
  `);

  if (count > 0) {
    throw new Error('Some categories have no prototype');
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('cf$').alterTable('category_prototype', table => {
    table.specificType('name_new', 'text');
  });

  await knex.raw(`
    update cf$.category_prototype
       set name_new = name -> 'ru'
  `);

  await knex.schema.withSchema('cf$').alterTable('category_prototype', table => {
    table.dropColumn('name');
    table.renameColumn('name_new', 'name');
  });
}
