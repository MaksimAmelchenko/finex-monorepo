import { IRequestContext } from '../../../../types/app';
import { DB, knex } from '../../../../libs/db';
import { IDBHousehold, IHousehold } from '../../../../types/household';
import { decodeDBHousehold } from './decode-db-household';

export async function createHousehold(ctx: IRequestContext): Promise<IHousehold> {
  const query = knex('cf$.household')
    .insert({
      // id_household: knex.raw("nextval('cf$.household_id_household_seq')"),
    })
    .returning('*')
    .toSQL()
    .toNative();

  const household: IDBHousehold = await DB.execute<IDBHousehold>(ctx.log, query.sql, query.bindings);
  return decodeDBHousehold(household);
}
