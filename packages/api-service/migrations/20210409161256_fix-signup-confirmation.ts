import * as Knex from 'knex';
import { create__jsonb_v2 } from './cf$_project/create__jsonb.function/v2';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(create__jsonb_v2.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(create__jsonb_v2.down);
}
