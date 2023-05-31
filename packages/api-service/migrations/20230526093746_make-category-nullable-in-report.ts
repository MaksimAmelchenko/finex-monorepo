import { Knex } from 'knex';

import { distribution_v1 } from './cf$_report/distribution.function/v1';
import { dynamics_v1 } from './cf$_report/dynamics.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(distribution_v1.up);
  await knex.schema.raw(dynamics_v1.up);
}

export async function down(knex: Knex): Promise<void> {}
