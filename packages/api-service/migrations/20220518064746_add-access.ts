import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('GRANT SELECT ON TABLE cf$.category_prototype TO web');

  await knex.schema.raw('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE cf$.contractor TO web');
  await knex.schema.raw('GRANT USAGE, SELECT ON SEQUENCE cf$.contractor_id_contractor_seq TO web');

  await knex.schema.raw('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE cf$.unit TO web');
  await knex.schema.raw('GRANT USAGE, SELECT ON SEQUENCE cf$.unit_id_unit_seq TO web');

  await knex.schema.raw('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE cf$.tag TO web');
  await knex.schema.raw('GRANT USAGE, SELECT ON SEQUENCE cf$.tag_id_tag_seq TO web');

  await knex.schema.raw('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE cf$.cashFlow TO web');
  await knex.schema.raw('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE cf$.cashFlow_detail TO web');
  await knex.schema.raw('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE cf$.account_balance TO web');

  await knex.schema.raw('GRANT USAGE ON SCHEMA "context" TO web');
  await knex.schema.raw('GRANT ALL ON FUNCTION "context".set(uuid, boolean) TO web');

  await knex.schema.raw('GRANT USAGE ON SCHEMA "error$" TO web');
  await knex.schema.raw('GRANT ALL ON FUNCTION "error$".raise(text, text, text, text, text) TO web');

  await knex.schema.raw('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE cf$.money TO web');
  await knex.schema.raw('GRANT USAGE, SELECT ON SEQUENCE cf$.money_id_money_seq TO web');

  await knex.schema.raw('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE cf$.category TO web');
  await knex.schema.raw('GRANT USAGE, SELECT ON SEQUENCE cf$.category_id_category_seq TO web');

  await knex.schema.raw('GRANT USAGE ON SCHEMA "cf$_project" TO web');

  await knex.schema.raw('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE cf$.account_type TO web');

  await knex.schema.raw('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE cf$.account TO web');
  await knex.schema.raw('GRANT USAGE, SELECT ON SEQUENCE cf$.account_id_account_seq TO web');

  await knex.schema.raw('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE cf$.account_permit TO web');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw('REVOKE SELECT ON TABLE cf$.category_prototype from web');

  await knex.schema.raw('REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLE cf$.contractor from web');
  await knex.schema.raw('REVOKE USAGE, SELECT ON SEQUENCE cf$.contractor_id_contractor_seq FROM web');

  await knex.schema.raw('REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLE cf$.unit from web');
  await knex.schema.raw('REVOKE USAGE, SELECT ON SEQUENCE cf$.unit_id_unit_seq FROM web');

  await knex.schema.raw('REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLE cf$.tag from web');
  await knex.schema.raw('REVOKE USAGE, SELECT ON SEQUENCE cf$.tag_id_tag_seq FROM web');

  await knex.schema.raw('REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLE cf$.cashFlow from web');
  await knex.schema.raw('REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLE cf$.cashFlow_detail from web');
  await knex.schema.raw('REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLE cf$.account_balance from web');

  await knex.schema.raw('REVOKE ALL ON FUNCTION "context".set(uuid, boolean) FROM web');
  await knex.schema.raw('REVOKE USAGE ON SCHEMA "context" FROM web');

  await knex.schema.raw('REVOKE ALL ON FUNCTION "error$".raise(text, text, text, text, text) FROM web');
  await knex.schema.raw('REVOKE USAGE ON SCHEMA "error$" FROM web');

  await knex.schema.raw('REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLE cf$.money from web');
  await knex.schema.raw('REVOKE USAGE, SELECT ON SEQUENCE cf$.money_id_money_seq FROM web');

  await knex.schema.raw('REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLE cf$.category from web');
  await knex.schema.raw('REVOKE USAGE, SELECT ON SEQUENCE cf$.category_id_category_seq FROM web');

  await knex.schema.raw('REVOKE USAGE ON SCHEMA "cf$_project" FROM web');

  await knex.schema.raw('REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLE cf$.account_type from web');

  await knex.schema.raw('REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLE cf$.account from web');
  await knex.schema.raw('REVOKE USAGE, SELECT ON SEQUENCE cf$.account_id_account_seq FROM web');

  await knex.schema.raw('REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLE cf$.account_permit from web');
}
