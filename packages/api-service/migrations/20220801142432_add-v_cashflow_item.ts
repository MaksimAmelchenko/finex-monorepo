import { Knex } from 'knex';

import { v_cashflow_item_v1 } from './cf$/v_cashflow_item.view/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(v_cashflow_item_v1.up);
  await knex.schema.raw('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE cf$.v_cashflow_item TO web');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLE cf$.v_cashflow_item from web');
  await knex.schema.raw(v_cashflow_item_v1.down);
}
