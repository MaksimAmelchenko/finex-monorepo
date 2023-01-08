import { Knex } from 'knex';

import { access_period_aiud_trigger_v1 } from './billing$/access_period_aiud.trigger/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA billing$');
  await knex.schema.raw('GRANT USAGE ON SCHEMA "billing$" TO web');
  await knex.schema.raw('REVOKE ALL ON SCHEMA "billing$" FROM PUBLIC');

  await knex.schema.withSchema('billing$').createTable('plan', table => {
    table.text('id').notNullable().primary();
    table.specificType('name', 'jsonb').notNullable();
    table.specificType('description', 'jsonb').notNullable();
    table.specificType('product_name', 'jsonb').notNullable().comment('Product description in an invoice');

    table.text('duration').notNullable().comment('e.g. P1M or P1Y');
    table.specificType('price', 'numeric');
    table.text('currency');
    table.specificType('available_payment_gateways', 'text[]').comment('yookassa, paypal');
    table.boolean('is_enabled').notNullable().defaultTo(true);
    table.boolean('is_renewable').notNullable().defaultTo(false);
    table.text('paypal_plan_id');
    table.timestamps({ useTimestamps: true, defaultToNow: true });
  });
  await knex.schema.raw('GRANT SELECT ON TABLE billing$.plan TO web');

  await knex.schema.withSchema('billing$').createTable('subscription', table => {
    table.uuid('id').notNullable().primary();
    table.integer('user_id').notNullable().index('subscription_user_id');
    table.foreign('user_id', 'subscription_2_user').references('id_user').inTable('core$.user').onDelete('cascade');

    table.text('status').notNullable().comment('pending, active, canceled');

    table.text('plan_id').notNullable();
    table.foreign('plan_id', 'subscription_2_plan').references('id').inTable('billing$.plan').onDelete('restrict');

    table.text('gateway');
    table.text('gateway_subscription_id').unique({ indexName: 'subscription_gateway_subscription_id_u' });
    table.specificType('gateway_metadata', 'jsonb');

    table.timestamps({ useTimestamps: true, defaultToNow: true });
  });
  await knex.schema.raw('GRANT SELECT, INSERT, UPDATE ON TABLE billing$.subscription TO web');

  await knex.schema.withSchema('billing$').createTable('access_period', table => {
    table.uuid('id').primary();
    table.integer('user_id').notNullable().index('access_period_user_id');
    table.foreign('user_id', 'access_period_2_user').references('id_user').inTable('core$.user').onDelete('cascade');
    table.text('plan_id').notNullable();
    table.foreign('plan_id', 'access_period_2_plan').references('id').inTable('billing$.plan').onDelete('restrict');

    table.datetime('start_at').notNullable();
    table.datetime('end_at').notNullable();

    table.timestamps({ useTimestamps: true, defaultToNow: true });
  });
  await knex.schema.raw('GRANT SELECT, INSERT, UPDATE ON TABLE billing$.access_period TO web');
  await knex.raw(access_period_aiud_trigger_v1.up);

  await knex.schema.withSchema('billing$').createTable('payment', table => {
    table.uuid('id');
    table.integer('user_id').notNullable().index('payment_user_id');
    table.foreign('user_id', 'payment_2_user').references('id_user').inTable('core$.user').onDelete('cascade');
    table.text('status').notNullable().comment('pending, succeeded, canceled');
    table.text('initiator').notNullable().comment('user, subscription');

    table.text('plan_id').notNullable();
    table.foreign('plan_id', 'payment_2_plan').references('id').inTable('billing$.plan').onDelete('restrict');

    table.uuid('subscription_id').notNullable();
    table
      .foreign('subscription_id', 'payment_2_subscription')
      .references('id')
      .inTable('billing$.subscription')
      .onDelete('restrict');

    table.specificType('amount', 'numeric');
    table.text('currency');
    table.timestamp('start_at').notNullable();
    table.timestamp('end_at').notNullable();

    table.text('gateway').notNullable();
    table.text('gateway_payment_id').unique({ indexName: 'gateway_payment_id_u' });
    table.specificType('gateway_responses', 'jsonb[]').notNullable();

    table.timestamps({ useTimestamps: true, defaultToNow: true });
  });
  await knex.schema.raw('GRANT SELECT, INSERT, UPDATE ON TABLE billing$.payment TO web');

  await knex.schema.withSchema('core$').alterTable('user', table => {
    table.datetime('access_until');
  });

  await knex.schema.withSchema('core$').alterTable('session', table => {
    table.datetime('access_until');
  });

  //
  await knex.schema.raw(`
    insert
      into billing$.plan ( id,
                           name,
                           description,
                           product_name,
                           duration, price, currency, is_enabled, is_renewable,
                           available_payment_gateways, paypal_plan_id )
    values ( 'trial',
             '{"en": "Trial", "ru": "Пробный период"}'::jsonb,
             '{"en": "The 14 day trial period", "ru": "Пробный 14-ий период"}'::jsonb,
             '{"en": ""}'::jsonb,
             'P14D', null, null, true, false,
             '{}', null ),
           ( 'free', '{"en": "Free forever", "ru": "Бесплатное использование"}'::jsonb,
             '{"en": ""}'::jsonb,
             '{"en": ""}'::jsonb,
             'P100Y', null, null, true, false,
             '{}', null ),
           ( 'monthlyRub',
             '{"en": "Monthly", "ru": "Месячная подписка"}'::jsonb,
             '{"en": ""}'::jsonb,
             '{"en": "Monthly subscription to FINEX", "ru": "Месячная подписка на сервис FINEX"}'::jsonb,
             'P1M', 129, 'RUB', true, true,
             '{"yookassa"}'::text[], null ),
           ( 'annualRub',
             '{"en": "Annual", "ru": "Годовая подписка"}'::jsonb,
             '{"en": "Save 20% with annual subscription", "ru": "Сохраните 20% с годовой подпиской"}'::jsonb,
             '{"en": "Annual subscription to FINEX", "ru": "Годовая подписка на сервис FINEX"}'::jsonb,
             'P1M', 1238, 'RUB', true, true,
             '{"yookassa"}'::text[], null ),
           ( 'monthlyEur',
             '{"en": "Monthly", "ru": "Месячная подписка"}'::jsonb,
             '{"en": ""}'::jsonb,
             '{"en": "Monthly subscription to FINEX", "ru": "Месячная подписка на сервис FINEX"}'::jsonb,
             'P1M', 2.9, 'EUR', true, true,
             '{}'::text[], null ),
           ( 'annualEur',
             '{"en": "Annual", "ru": "Годовая подписка"}'::jsonb,
             '{"en": "Save 20% with annual subscription", "ru": "Сохраните 20% с годовой подпиской"}'::jsonb,
             '{"en": "Annual subscription to FINEX", "ru": "Годовая подписка на сервис FINEX"}'::jsonb,
             'P1M', 27.80, 'EUR', true, true,
             '{}'::text[], null )
  `);

  // add free plan to all registered users
  await knex.schema.raw(`
    insert
      into billing$.subscription ( id, user_id, status, plan_id )
    select gen_random_uuid(),
           u.id_user,
           'active',
           'free'
      from core$.user u;
  `);

  // add free lifetime access to all registered users and initialize the user.access_until field
  await knex.schema.raw(`
    insert
      into billing$.access_period ( id, user_id, plan_id, start_at, end_at )
    select gen_random_uuid(),
           u.id_user,
           'free',
           u.created_at,
           '2050-01-01'::date
      from core$.user u;
  `);

  await knex.schema.raw(`
    update core$.session s
       set access_until = u.access_until
      from core$.user u
     where s.id_user = u.id_user
  `);

  // field is filled. Need to make it mandatory
  await knex.schema.withSchema('core$').alterTable('user', table => {
    table.datetime('access_until').notNullable().alter();
  });

  await knex.schema.withSchema('core$').alterTable('session', table => {
    table.datetime('access_until').notNullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(access_period_aiud_trigger_v1.down);

  await knex.schema.dropTable('billing$.payment');
  await knex.schema.dropTable('billing$.access_period');
  await knex.schema.dropTable('billing$.subscription');
  await knex.schema.dropTable('billing$.plan');

  await knex.schema.withSchema('core$').alterTable('user', table => {
    table.dropColumn('access_until');
  });
  await knex.schema.withSchema('core$').alterTable('session', table => {
    table.dropColumn('access_until');
  });
  await knex.schema.raw('DROP SCHEMA billing$');
}
