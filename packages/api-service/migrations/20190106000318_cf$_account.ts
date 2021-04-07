import * as Knex from 'knex';

import { permit_v1 } from './cf$_account/permit.function/v1';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(permit_v1.up);
  await knex.schema.raw(
    "COMMENT ON FUNCTION cf$_account.permit(iid_project integer) IS 'Список счетов и прав на них для текущего пользователя. Permit - право на данный счет (1 - можно читать, 3 - можно читать и редактировать, 7 - владелец счета'"
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(permit_v1.down);
}
