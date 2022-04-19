import { Knex } from 'knex';

import { decode_currency_code_v1 } from './cf$_import/decode_currency_code.function/v1';
import { do_v1 } from './cf$_import/do.function/v1';
import { drebedengi_v1 } from './cf$_import/drebedengi.function/v1';
import { homebuh5_v1 } from './cf$_import/homebuh5.function/v1';
import { homemoney_v1 } from './cf$_import/homemoney.function/v1';
import { zenmoney_v1 } from './cf$_import/zenmoney.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA cf$_import;');
  await knex.schema.raw('REVOKE ALL ON SCHEMA "cf$_import" FROM PUBLIC;');
  await knex.schema.raw(decode_currency_code_v1.up);
  await knex.schema.raw(do_v1.up);
  await knex.schema.raw(drebedengi_v1.up);
  await knex.schema.raw(homebuh5_v1.up);
  await knex.schema.raw(homemoney_v1.up);
  await knex.schema.raw(zenmoney_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(decode_currency_code_v1.down);
  await knex.schema.raw(do_v1.down);
  await knex.schema.raw(drebedengi_v1.down);
  await knex.schema.raw(homebuh5_v1.down);
  await knex.schema.raw(homemoney_v1.down);
  await knex.schema.raw(zenmoney_v1.down);

  await knex.schema.raw('DROP SCHEMA cf$_import;');
}
