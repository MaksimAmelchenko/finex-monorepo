import { Knex } from 'knex';

import { dir_name_v1 } from './core$_file/dir_name.function/v1';
import { format_file_name_v1 } from './core$_file/format_file_name.function/v1';
import { get_v1 } from './core$_file/get.function/v1';
import { get_content_v1 } from './core$_file/get_content.function/v1';
import { put_v1 } from './core$_file/put.function/v1';
import { save_v1 } from './core$_file/save.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA core$_file;');
  await knex.schema.raw('REVOKE ALL ON SCHEMA "core$_file" FROM PUBLIC;');
  await knex.schema.raw(dir_name_v1.up);
  await knex.schema.raw(format_file_name_v1.up);
  await knex.schema.raw(get_v1.up);
  await knex.schema.raw(get_content_v1.up);
  await knex.schema.raw(put_v1.up);
  await knex.schema.raw(save_v1.up);

  // await knex.schema.raw(
  //   'ALTER FUNCTION "core$_file".get_content(iid_file integer, OUT ocontent text) OWNER TO postgres;'
  // );
  // await knex.schema.raw(
  //   'ALTER FUNCTION "core$_file".save(iname text, icontent text, OUT oid_file integer) OWNER TO postgres;'
  // );
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(dir_name_v1.down);
  await knex.schema.raw(format_file_name_v1.down);
  await knex.schema.raw(get_v1.down);
  await knex.schema.raw(get_content_v1.down);
  await knex.schema.raw(put_v1.down);
  await knex.schema.raw(save_v1.down);

  await knex.schema.raw('DROP SCHEMA core$_file;');
}
