import * as Knex from 'knex';

import { permit_v1 } from './cf$_project/permit.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE SCHEMA cf$_project;');
  await knex.schema.raw('REVOKE ALL ON SCHEMA "cf$_project" FROM PUBLIC;');
  await knex.schema.raw(permit_v1.up);
  await knex.schema.raw(
    "COMMENT ON FUNCTION cf$_project.permit() IS 'Id_Project - проект  Permit - право на данный счет (3 - можно читать и редактировать, 7 - владелец проекта)'"
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(permit_v1.down);

  await knex.schema.raw('DROP SCHEMA cf$_project;');
}
