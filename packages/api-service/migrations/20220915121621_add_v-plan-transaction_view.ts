import { Knex } from 'knex';

import { v_plan_transaction_v1 } from './cf$/v_plan_transaction.view/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(v_plan_transaction_v1.up);
  await knex.schema.raw('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE cf$.v_plan_transaction TO web');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLE cf$.v_plan_transaction from web');
  await knex.schema.raw(v_plan_transaction_v1.down);
}
