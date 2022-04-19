import { Knex } from 'knex';

import { accept_v1 } from './cf$_invitation/accept.function/v1';
import { create_v1 } from './cf$_invitation/create.function/v1';
import { get_v1 } from './cf$_invitation/get.function/v1';
import { reject_v1 } from './cf$_invitation/reject.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA cf$_invitation;');
  await knex.schema.raw('REVOKE ALL ON SCHEMA "cf$_invitation" FROM PUBLIC;');
  await knex.schema.raw(accept_v1.up);
  await knex.schema.raw(create_v1.up);
  await knex.schema.raw(get_v1.up);
  await knex.schema.raw(reject_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(accept_v1.down);
  await knex.schema.raw(create_v1.down);
  await knex.schema.raw(get_v1.down);
  await knex.schema.raw(reject_v1.down);

  await knex.schema.raw('DROP SCHEMA cf$_invitation;');
}
