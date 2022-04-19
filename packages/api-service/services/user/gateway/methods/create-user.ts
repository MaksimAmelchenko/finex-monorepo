import { IRequestContext } from '../../../../types/app';
import { DB, knex } from '../../../../libs/db';
import { decodeDBUser } from './decode-db-user';
import { ICreateParams, IDBUser, IUser } from '../../../../types/user';

export async function createUser(ctx: IRequestContext, params: ICreateParams): Promise<IUser> {
  const query = knex('core$.user')
    .insert({
      ...params,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .returning('*')
    .toSQL()
    .toNative();

  const user: IDBUser = await DB.execute(ctx.log, query.sql, query.bindings);
  return decodeDBUser(user);
}
