import { Knex } from 'knex';

import { distribution_v1 } from './cf$_report/distribution.function/v1';
import { distribution_built_result_v1 } from './cf$_report/distribution_built_result.function/v1';
import { dynamics_v1 } from './cf$_report/dynamics.function/v1';
import { dynamics_built_result_v1 } from './cf$_report/dynamics_built_result.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA cf$_report;');
  await knex.schema.raw('REVOKE ALL ON SCHEMA "cf$_report" FROM PUBLIC;');
  await knex.schema.raw(distribution_v1.up);
  await knex.schema.raw(distribution_built_result_v1.up);
  await knex.schema.raw(dynamics_v1.up);
  await knex.schema.raw(dynamics_built_result_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(distribution_v1.down);
  await knex.schema.raw(distribution_built_result_v1.down);
  await knex.schema.raw(dynamics_v1.down);
  await knex.schema.raw(dynamics_built_result_v1.down);

  await knex.schema.raw('DROP SCHEMA cf$_report;');
}
