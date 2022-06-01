import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('GRANT SELECT ON TABLE cf$.category_prototype TO web');

  await knex.schema.raw('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE cf$.contractor TO web');
  await knex.schema.raw('GRANT USAGE, SELECT ON SEQUENCE cf$.contractor_id_contractor_seq TO web');

  await knex.schema.raw('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE cf$.unit TO web');
  await knex.schema.raw('GRANT USAGE, SELECT ON SEQUENCE cf$.unit_id_unit_seq TO web');
  await knex.schema.raw('GRANT USAGE ON SCHEMA "context" TO web');
  await knex.schema.raw('GRANT ALL ON FUNCTION "context".set(uuid, boolean) TO web');

  await knex.schema.raw('GRANT USAGE ON SCHEMA "error$" TO web');
  await knex.schema.raw('GRANT ALL ON FUNCTION "error$".raise(text, text, text, text, text) TO web');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('REVOKE SELECT ON TABLE cf$.category_prototype from web');

  await knex.schema.raw('REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLE cf$.contractor from web');
  await knex.schema.raw('REVOKE USAGE, SELECT ON SEQUENCE cf$.contractor_id_contractor_seq FROM web');

  await knex.schema.raw('REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLE cf$.unit from web');
  await knex.schema.raw('REVOKE USAGE, SELECT ON SEQUENCE cf$.unit_id_unit_seq FROM web');
  await knex.schema.raw('REVOKE ALL ON FUNCTION "context".set(uuid, boolean) FROM web');
  await knex.schema.raw('REVOKE USAGE ON SCHEMA "context" FROM web');

  await knex.schema.raw('REVOKE ALL ON FUNCTION "error$".raise(text, text, text, text, text) FROM web');
  await knex.schema.raw('REVOKE USAGE ON SCHEMA "error$" FROM web');
}
