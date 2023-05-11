import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA cf$_connection');
  await knex.schema.raw('GRANT USAGE ON SCHEMA "cf$_connection" TO web');

  await knex.schema.withSchema('cf$_connection').createTable('country', table => {
    table.text('code').comment('ISO 3166 two-character country code').notNullable();
    table.specificType('name', 'jsonb').notNullable();
  });
  await knex.schema.raw('GRANT SELECT ON "cf$_connection".country TO web');

  await knex.raw(`
    merge into cf$_connection.country c
    using (
        select value ->> 'code' as code,
               value -> 'name' as name
          from jsonb_array_elements('[
            { "code": "AT", "name": { "en": "Austria", "de": "Österreich", "ru": "Австрия" } },
            { "code": "BE", "name": { "en": "Belgium", "de": "Belgien", "ru": "Бельгия" } },
            { "code": "BG", "name": { "en": "Bulgaria", "de": "Bulgarien", "ru": "Болгария" } },
            { "code": "HR", "name": { "en": "Croatia", "de": "Kroatien", "ru": "Хорватия" } },
            { "code": "CY", "name": { "en": "Cyprus", "de": "Zypern", "ru": "Кипр" } },
            { "code": "CZ", "name": { "en": "Czech Republic", "de": "Tschechien", "ru": "Чехия" } },
            { "code": "DK", "name": { "en": "Denmark", "de": "Dänemark", "ru": "Дания" } },
            { "code": "EE", "name": { "en": "Estonia", "de": "Estland", "ru": "Эстония" } },
            { "code": "FI", "name": { "en": "Finland", "de": "Finnland", "ru": "Финляндия" } },
            { "code": "FR", "name": { "en": "France", "de": "Frankreich", "ru": "Франция" } },
            { "code": "DE", "name": { "en": "Germany", "de": "Deutschland", "ru": "Германия" } },
            { "code": "GR", "name": { "en": "Greece", "de": "Griechenland", "ru": "Греция" } },
            { "code": "HU", "name": { "en": "Hungary", "de": "Ungarn", "ru": "Венгрия" } },
            { "code": "IS", "name": { "en": "Iceland", "de": "Island", "ru": "Исландия" } },
            { "code": "IE", "name": { "en": "Ireland", "de": "Irland", "ru": "Ирландия" } },
            { "code": "IT", "name": { "en": "Italy", "de": "Italien", "ru": "Италия" } },
            { "code": "LV", "name": { "en": "Latvia", "de": "Lettland", "ru": "Латвия" } },
            { "code": "LT", "name": { "en": "Lithuania", "de": "Litauen", "ru": "Литва" } },
            { "code": "LI", "name": { "en": "Liechtenstein", "de": "Liechtenstein", "ru": "Лихтенштейн" } },
            { "code": "LU", "name": { "en": "Luxembourg", "de": "Luxemburg", "ru": "Люксембург" } },
            { "code": "MT", "name": { "en": "Malta", "de": "Malta", "ru": "Мальта" } },
            { "code": "NL", "name": { "en": "Netherlands", "de": "Niederlande", "ru": "Нидерланды" } },
            { "code": "NO", "name": { "en": "Norway", "de": "Norwegen", "ru": "Норвегия" } },
            { "code": "PL", "name": { "en": "Poland", "de": "Polen", "ru": "Польша" } },
            { "code": "PT", "name": { "en": "Portugal", "de": "Portugal", "ru": "Португалия" } },
            { "code": "RO", "name": { "en": "Romania", "de": "Rumänien", "ru": "Румыния" } },
            { "code": "SK", "name": { "en": "Slovakia", "de": "Slowakei", "ru": "Словакия" } },
            { "code": "SI", "name": { "en": "Slovenia", "de": "Slowenien", "ru": "Словения" } },
            { "code": "ES", "name": { "en": "Spain", "de": "Spanien", "ru": "Испания" } },
            { "code": "SE", "name": { "en": "Sweden", "de": "Schweden", "ru": "Швеция" } },
            { "code": "GB", "name": { "en": "United Kingdom", "de": "Vereinigtes Königreich", "ru": "Великобритания" } }
    ]'::jsonb) as value) s
      on s.code = c.code
    when matched then
      update
         set name = s.name
    when not matched then
      insert (code, name)
      values (s.code, s.name)
  `);

  await knex.schema.withSchema('cf$_connection').createTable('institution', table => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()'));
    table.text('name').notNullable();
    table.text('logo').notNullable();
    table.text('country').comment('ISO 3166 two-character country code').notNullable();
    table.text('bic');
    table.timestamps(true, true);
  });
  await knex.schema.raw('GRANT SELECT ON "cf$_connection".institution TO web');

  await knex.schema.withSchema('cf$_connection').createTable('connection', table => {
    table.integer('project_id').notNullable();
    table.integer('user_id').notNullable();
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()'));
    table.text('institution_name').notNullable();
    table.text('institution_logo').notNullable();
    table.text('provider').notNullable();
    table.timestamps(true, true);

    table.primary(['project_id', 'user_id', 'id'], { constraintName: 'connection_pk' });

    table.foreign('user_id', 'connection_x_user_fk').references('id_user').inTable('core$.user').onDelete('CASCADE');

    table
      .foreign('project_id', 'connection_x_project_fk')
      .references('id_project')
      .inTable('cf$.project')
      .onDelete('CASCADE');
  });
  await knex.schema.raw('GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE "cf$_connection".connection TO web');

  await knex.schema.withSchema('cf$_connection').createTable('account', table => {
    table.integer('project_id').notNullable();
    table.integer('user_id').notNullable();
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('connection_id').notNullable();
    table.text('provider_account_id').notNullable();
    table.text('provider_account_name').notNullable();
    table.text('provider_account_product');
    table.integer('account_id');
    table.date('sync_from');
    table.timestamps(true, true);

    table.primary(['project_id', 'user_id', 'id'], { constraintName: 'account_pk' });
    table.unique(['project_id', 'account_id'], { indexName: 'account_account_u' });

    table.foreign('user_id', 'account_x_user_fk').references('id_user').inTable('core$.user').onDelete('CASCADE');

    table
      .foreign(['project_id', 'account_id'], 'account_x_account_fk')
      .references(['id_project', 'id_account'])
      .inTable('cf$.account')
      .onDelete('CASCADE');

    table
      .foreign(['project_id', 'user_id', 'connection_id'], 'account_x_connection_fk')
      .references(['project_id', 'user_id', 'id'])
      .inTable('cf$_connection.connection')
      .onDelete('CASCADE');

    table
      .foreign('project_id', 'account_x_project_fk')
      .references('id_project')
      .inTable('cf$.project')
      .onDelete('CASCADE');
  });
  await knex.schema.raw('GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE "cf$_connection".account TO web');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('DROP SCHEMA cf$_connection CASCADE');
}
