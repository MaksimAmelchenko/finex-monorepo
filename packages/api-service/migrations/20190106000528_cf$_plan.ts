import * as Knex from 'knex';

import { cancel_v1 } from './cf$_plan/cancel.function/v1';
import { create_v1 } from './cf$_plan/create.function/v1';
import { schedule_v1 } from './cf$_plan/schedule.function/v1';
import { update_v1 } from './cf$_plan/update.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA cf$_plan;');
  await knex.schema.raw('REVOKE ALL ON SCHEMA "cf$_plan" FROM PUBLIC;');
  await knex.schema.raw(cancel_v1.up);
  await knex.schema.raw(create_v1.up);
  await knex.schema.raw(schedule_v1.up);
  await knex.schema.raw(update_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(cancel_v1.down);
  await knex.schema.raw(create_v1.down);
  await knex.schema.raw(schedule_v1.down);
  await knex.schema.raw(update_v1.down);

  await knex.schema.raw('DROP SCHEMA cf$_plan;');
}
