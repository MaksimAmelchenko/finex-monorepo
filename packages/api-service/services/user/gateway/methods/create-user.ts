import * as moment from 'moment';
import { IRequestContext } from '../../../../types/app';
import { DB, knex } from '../../../../libs/db';
import { decodeDBUser } from './decode-db-user';
import { ICreateParams, IDBUser, IUser } from '../../../../types/user';

export async function createUser(ctx: IRequestContext, params: ICreateParams): Promise<IUser> {
  const now = moment.utc();
  const query = knex('core$.user')
    .insert({
      ...params,
      created_at: now.format(),
      updated_at: now.format(),
    })
    .returning('*')
    .toSQL()
    .toNative();

  const user: IDBUser = await DB.execute(ctx.log, query.sql, query.bindings);
  return decodeDBUser(user);
}
