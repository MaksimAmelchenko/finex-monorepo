import { Knex } from 'knex';

import { v_cashflow_v1 } from './cf$/v_cashflow.view/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(v_cashflow_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(v_cashflow_v1.down);
}
