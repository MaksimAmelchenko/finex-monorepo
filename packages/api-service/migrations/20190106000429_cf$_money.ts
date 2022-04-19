import { Knex } from 'knex';

import { create_v1 } from './cf$_money/create.function/v1';
import { destroy_v1 } from './cf$_money/destroy.function/v1';
import { exchange_v1 } from './cf$_money/exchange.function/v1';
import { get_v1 } from './cf$_money/get.function/v1';
import { get_money_by_currency_v1 } from './cf$_money/get_money_by_currency.function/v1';
import { sort_v1 } from './cf$_money/sort.function/v1';
import { update_v1 } from './cf$_money/update.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA cf$_money;');
  await knex.schema.raw('REVOKE ALL ON SCHEMA "cf$_money" FROM PUBLIC;');
  await knex.schema.raw(create_v1.up);
  await knex.schema.raw(destroy_v1.up);
  await knex.schema.raw(exchange_v1.up);
  await knex.schema.raw(get_v1.up);
  await knex.schema.raw(get_money_by_currency_v1.up);
  await knex.schema.raw(sort_v1.up);
  await knex.schema.raw(update_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(create_v1.down);
  await knex.schema.raw(destroy_v1.down);
  await knex.schema.raw(exchange_v1.down);
  await knex.schema.raw(get_v1.down);
  await knex.schema.raw(get_money_by_currency_v1.down);
  await knex.schema.raw(sort_v1.down);
  await knex.schema.raw(update_v1.down);

  await knex.schema.raw('DROP SCHEMA cf$_money;');
}
