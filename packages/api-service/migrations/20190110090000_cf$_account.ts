import { Knex } from 'knex';

import { account_balance_w_p_v1 } from './cf$_account/account_balance_w_p.function/v1';
import { balance__date_integer_v1 } from './cf$_account/balance__date_integer.function/v1';
import { balance__jsonb_v1 } from './cf$_account/balance__jsonb.function/v1';
import { balance_daily_v1 } from './cf$_account/balance_daily.function/v1';
import { get_permit_v1 } from './cf$_account/get_permit.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(account_balance_w_p_v1.up);
  await knex.schema.raw(balance__date_integer_v1.up);
  await knex.schema.raw(balance__jsonb_v1.up);
  await knex.schema.raw(balance_daily_v1.up);
  await knex.schema.raw(get_permit_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(account_balance_w_p_v1.down);
  await knex.schema.raw(balance__date_integer_v1.down);
  await knex.schema.raw(balance__jsonb_v1.down);
  await knex.schema.raw(balance_daily_v1.down);
  await knex.schema.raw(get_permit_v1.down);
}
