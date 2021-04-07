import { IRequestContext } from '../../../../types/app';
import { DB, knex } from '../../../../libs/db';
import { decodeDBHousehold } from './decode-db-household';
import { IDBHousehold, IHousehold } from '../../../../types/household';

export async function getHousehold(ctx: IRequestContext, householdId: number): Promise<IHousehold> {
  const query = knex
    .select('*')
    .from('cf$.household')
    .where(knex.raw('id_household = ?', [householdId]))
    .toSQL()
    .toNative();
  const household: IDBHousehold = await DB.execute(ctx.log, query.sql, query.bindings);
  return decodeDBHousehold(household);
}
