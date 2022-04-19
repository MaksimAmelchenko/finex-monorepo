import { Knex } from 'knex';

import { exchange_v1 } from './cf$_currency/exchange.function/v1';
import { exchange_old_v1 } from './cf$_currency/exchange_old.function/v1';
import { get_v1 } from './cf$_currency/get.function/v1';
import { get_rate_v1 } from './cf$_currency/get_rate.function/v1';
import { get_rate_old_v1 } from './cf$_currency/get_rate_old.function/v1';
import { upload_cbr_v1 } from './cf$_currency/upload_cbr.function/v1';
import { upload_openexchangerates_v1 } from './cf$_currency/upload_openexchangerates.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA cf$_currency;');
  await knex.schema.raw('REVOKE ALL ON SCHEMA "cf$_currency" FROM PUBLIC;');
  await knex.schema.raw(exchange_v1.up);
  await knex.schema.raw(exchange_old_v1.up);
  await knex.schema.raw(get_v1.up);
  await knex.schema.raw(get_rate_v1.up);
  await knex.schema.raw(get_rate_old_v1.up);
  await knex.schema.raw(upload_cbr_v1.up);
  await knex.schema.raw(upload_openexchangerates_v1.up);
  await knex.schema.raw('GRANT USAGE ON SCHEMA "cf$_currency" TO job;');
  await knex.schema.raw(
    'GRANT ALL ON FUNCTION "cf$_currency".upload_openexchangerates(iparams jsonb, OUT oresult text) TO job;'
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(exchange_v1.down);
  await knex.schema.raw(exchange_old_v1.down);
  await knex.schema.raw(get_v1.down);
  await knex.schema.raw(get_rate_v1.down);
  await knex.schema.raw(get_rate_old_v1.down);
  await knex.schema.raw(upload_cbr_v1.down);
  await knex.schema.raw(upload_openexchangerates_v1.down);
  await knex.schema.raw('DROP SCHEMA cf$_currency;');
}
