import { Knex } from 'knex';

import { create_v1 } from './cf$_tag/create.function/v1';
import { decode_v1 } from './cf$_tag/decode.function/v1';
import { destroy_v1 } from './cf$_tag/destroy.function/v1';
import { encode_v1 } from './cf$_tag/encode.function/v1';
import { get_v1 } from './cf$_tag/get.function/v1';
import { update_v1 } from './cf$_tag/update.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA cf$_tag;');
  await knex.schema.raw('REVOKE ALL ON SCHEMA "cf$_tag" FROM PUBLIC;');
  await knex.schema.raw(create_v1.up);
  await knex.schema.raw(decode_v1.up);
  await knex.schema.raw(destroy_v1.up);
  await knex.schema.raw(encode_v1.up);
  await knex.schema.raw(get_v1.up);
  await knex.schema.raw(update_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(create_v1.down);
  await knex.schema.raw(decode_v1.down);
  await knex.schema.raw(destroy_v1.down);
  await knex.schema.raw(encode_v1.down);
  await knex.schema.raw(get_v1.down);
  await knex.schema.raw(update_v1.down);

  await knex.schema.raw('DROP SCHEMA cf$_tag;');
}
