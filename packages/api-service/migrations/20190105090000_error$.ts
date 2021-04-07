import * as Knex from 'knex';

import { format_fault_v1 } from './error$/format_fault.function/v1';
import { raise_v1 } from './error$/raise.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA error$;');
  await knex.schema.raw(format_fault_v1.up);
  await knex.schema.raw(raise_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(format_fault_v1.down);
  await knex.schema.raw(raise_v1.down);
  await knex.schema.raw('DROP SCHEMA error$;');
}
