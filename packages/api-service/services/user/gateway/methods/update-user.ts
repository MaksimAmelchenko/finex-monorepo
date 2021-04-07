import * as moment from 'moment';
import { IRequestContext } from '../../../../types/app';
import { DB, knex } from '../../../../libs/db';
import { decodeDBUser } from './decode-db-user';
import { IDBUser, IUpdateParams, IUser } from '../../../../types/user';

export async function updateUser(ctx: IRequestContext, userId: number, params: IUpdateParams): Promise<IUser> {
  const now = moment.utc();

  const query = knex('core$.user')
    .where(knex.raw('id_user = ?', [userId]))
    .update({
      ...params,
      updated_at: now.format(),
    })
    .returning('*')
    .toSQL()
    .toNative();

  return DB.execute<IDBUser>(ctx.log, query.sql, query.bindings).then(decodeDBUser);
}
