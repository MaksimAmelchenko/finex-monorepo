import { Knex } from 'knex';

import { cf$_money_exchange_v2 } from './cf$_money/exchange.function/v2';
import { create_v1 as cf$_money_create_v1 } from './cf$_money/create.function/v1';
import { destroy_v1 as cf$_money_destroy_v1 } from './cf$_money/destroy.function/v1';
import { exchange_v1 as cf$_money_exchange_v1 } from './cf$_money/exchange.function/v1';
import { get_money_by_currency_v1 as cf$_money_get_money_by_currency_v1 } from './cf$_money/get_money_by_currency.function/v1';
import { get_v1 as cf$_money_get_v1 } from './cf$_money/get.function/v1';
import { sort_v1 as cf$_money_sort_v1 } from './cf$_money/sort.function/v1';
import { update_v1 as cf$_money_update_v1 } from './cf$_money/update.function/v1';

import { v_money_v1 } from './cf$/v_money.view/v1';

import { cf$_currency_exchange_v2 } from './cf$_currency/exchange.function/v2';
import { cf$_currency_get_rate_v2 } from './cf$_currency/get_rate.function/v2';
import { exchange_old_v1 as cf$_currency_exchange_old_v1 } from './cf$_currency/exchange_old.function/v1';
import { exchange_v1 as cf$_currency_exchange_v1 } from './cf$_currency/exchange.function/v1';
import { get_rate_old_v1 as cf$_currency_get_rate_old_v1 } from './cf$_currency/get_rate_old.function/v1';
import { get_rate_v1 as cf$_currency_get_rate_v1 } from './cf$_currency/get_rate.function/v1';
import { get_v1 as cf$_currency_get_v1 } from './cf$_currency/get.function/v1';
import { upload_cbr_v1 as cf$_currency_upload_cbr_v1 } from './cf$_currency/upload_cbr.function/v1';
import { upload_openexchangerates_v1 as cf$_currency_upload_openexchangerates_v1 } from './cf$_currency/upload_openexchangerates.function/v1';

import { get_v1 as cf$_currency_rate_source_get_v1 } from './cf$_currency_rate_source/get.function/v1';

import { get_v1 as cf$_money_rate_get_v1 } from './cf$_money_rate/get.function/v1';

import { cancel_v1 as cf$_plan_cancel_v1 } from './cf$_plan/cancel.function/v1';
import { create_v1 as cf$_plan_create_v1 } from './cf$_plan/create.function/v1';
import { schedule_v1 as cf$_plan_schedule_v1 } from './cf$_plan/schedule.function/v1';
import { update_v1 as cf$_plan_update_v1 } from './cf$_plan/update.function/v1';

import { cf$_plan_schedule_v2 } from './cf$_plan/schedule.function/v2';

import { account_balance_w_p_v1 } from './cf$_account/account_balance_w_p.function/v1';
import { account_balance_with_plan_v1 } from './cf$_account/account_balance_with_plan.function/v1';

export async function up(knex: Knex): Promise<void> {

  await knex.schema.raw(account_balance_w_p_v1.up);
  await knex.schema.raw(account_balance_with_plan_v1.up);

  return Promise.resolve();

  await knex.schema.raw(cf$_money_rate_get_v1.down);
  await knex.schema.raw('DROP SCHEMA cf$_money_rate');

  await knex.schema.raw(cf$_money_create_v1.down);
  await knex.schema.raw(cf$_money_destroy_v1.down);
  await knex.schema.raw(cf$_money_exchange_v1.down);
  await knex.schema.raw(cf$_money_get_v1.down);
  await knex.schema.raw(cf$_money_get_money_by_currency_v1.down);
  await knex.schema.raw(cf$_money_sort_v1.down);
  await knex.schema.raw(cf$_money_update_v1.down);

  await knex.schema.raw(v_money_v1.down);

  await knex.schema.raw(cf$_currency_rate_source_get_v1.down);
  await knex.schema.raw('DROP SCHEMA cf$_currency_rate_source;');

  await knex.schema.raw(cf$_currency_exchange_v1.down);
  await knex.schema.raw(cf$_currency_exchange_old_v1.down);
  await knex.schema.raw(cf$_currency_get_v1.down);
  await knex.schema.raw(cf$_currency_get_rate_v1.down);
  await knex.schema.raw(cf$_currency_get_rate_old_v1.down);
  await knex.schema.raw(cf$_currency_upload_cbr_v1.down);
  await knex.schema.raw(cf$_currency_upload_openexchangerates_v1.down);

  await knex.schema.withSchema('cf$').alterTable('money', table => {
    table.text('currency_code').index();
  });

  await knex.raw(`
    update cf$.money m
       set currency_code = c.code,
           symbol = c.symbol,
           precision = c.precision
      from cf$.currency c
     where c.id_currency = m.id_currency
       and m.id_currency is not null
  `);

  await knex.schema.withSchema('cf$').alterTable('money', table => {
    table.dropColumn('id_currency');
  });

  // make structure of currency_rate table more consistent
  await knex.schema.withSchema('cf$').alterTable('currency_rate', table => {
    table.dropUnique(
      ['id_currency_rate_source', 'id_currency', 'drate'],
      'currency_rate_id_currency_rate_source_id_currency_drate'
    );
    table.text('currency_code');
    table.renameColumn('id_currency_rate_source', 'currency_rate_source_id');
    table.renameColumn('drate', 'rate_date');
  });

  await knex.raw(`
    update cf$.currency_rate cr
       set currency_code = c.code
      from cf$.currency c
     where c.id_currency = cr.id_currency
  `);

  await knex.raw(`delete from cf$.currency_rate where currency_code is null`);

  await knex.schema.withSchema('cf$').alterTable('currency_rate', table => {
    table.text('currency_code').notNullable().alter();
    table.dropColumn('id_currency');
    table.unique(['currency_rate_source_id', 'currency_code', 'rate_date'], {
      indexName: 'currency_rate__currency_rate_source_id__currency_code__rate_date',
    });
  });

  await knex.schema.raw('GRANT SELECT, UPDATE, INSERT ON TABLE "cf$".currency_rate TO web');

  await knex.schema.raw(cf$_currency_get_rate_v2.up);
  await knex.schema.raw(cf$_currency_exchange_v2.up);

  await knex.schema.raw('GRANT USAGE ON SCHEMA "cf$_currency" TO web');
  await knex.schema.raw('GRANT EXECUTE ON FUNCTION cf$_currency.get_rate(text, date, integer) to web');
  await knex.schema.raw(
    'GRANT EXECUTE ON FUNCTION cf$_currency.exchange(numeric, text, text, date, integer, boolean) to web'
  );

  await knex.schema.raw(cf$_money_exchange_v2.up);
  await knex.schema.raw('GRANT USAGE ON SCHEMA "cf$_money" TO web');
  await knex.schema.raw(
    'GRANT EXECUTE ON FUNCTION cf$_money.exchange(integer, numeric, integer, integer, date, integer, boolean) to web'
  );

  await knex.schema.raw(cf$_plan_cancel_v1.down);
  await knex.schema.raw(cf$_plan_create_v1.down);
  await knex.schema.raw(cf$_plan_update_v1.down);

  await knex.schema.raw(cf$_plan_schedule_v1.up);
  await knex.schema.raw(cf$_plan_schedule_v2.up);

  await knex.schema.raw(account_balance_w_p_v1.up);
  await knex.schema.raw(account_balance_with_plan_v1.up);
}

export async function down(knex: Knex): Promise<void> {}
