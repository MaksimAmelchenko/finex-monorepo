import { Knex } from 'knex';

import { copy__integer_integer_v1 } from './cf$_project/copy__integer_integer.function/v1';
import { copy__jsonb_v1 } from './cf$_project/copy__jsonb.function/v1';
import { create__jsonb_v1 } from './cf$_project/create__jsonb.function/v1';
import { create__text_text_v1 } from './cf$_project/create__text_text.function/v1';
import { get_badges_v1 } from './cf$_project/get_badges.function/v1';
import { get_dependency_v1 } from './cf$_project/get_dependency.function/v1';
import { get_permit_v1 } from './cf$_project/get_permit.function/v1';
import { merge__integer_integer_v1 } from './cf$_project/merge__integer_integer.function/v1';
import { merge__jsonb_v1 } from './cf$_project/merge__jsonb.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(copy__integer_integer_v1.up);
  await knex.schema.raw(copy__jsonb_v1.up);
  await knex.schema.raw(get_badges_v1.up);
  await knex.schema.raw(get_dependency_v1.up);
  await knex.schema.raw(get_permit_v1.up);
  await knex.schema.raw(merge__integer_integer_v1.up);
  await knex.schema.raw(merge__jsonb_v1.up);
  await knex.schema.raw(create__jsonb_v1.up);
  await knex.schema.raw(create__text_text_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(copy__integer_integer_v1.down);
  await knex.schema.raw(copy__jsonb_v1.down);
  await knex.schema.raw(get_badges_v1.down);
  await knex.schema.raw(get_dependency_v1.down);
  await knex.schema.raw(get_permit_v1.down);
  await knex.schema.raw(merge__integer_integer_v1.down);
  await knex.schema.raw(merge__jsonb_v1.down);
  await knex.schema.raw(create__jsonb_v1.down);
  await knex.schema.raw(create__text_text_v1.down);
}
