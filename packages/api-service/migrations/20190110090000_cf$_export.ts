import { Knex } from 'knex';
import { do_v1 } from './cf$_export/do.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA cf$_export;');
  await knex.schema.raw('REVOKE ALL ON SCHEMA "cf$_export" FROM PUBLIC;');
  await knex.schema.raw(do_v1.up);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(do_v1.down);

  await knex.schema.raw('DROP SCHEMA cf$_export;');
}
