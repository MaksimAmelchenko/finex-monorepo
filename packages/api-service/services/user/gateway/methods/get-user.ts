import { IRequestContext } from '../../../../types/app';
import { DB, knex } from '../../../../libs/db';
import { decodeDBUser } from './decode-db-user';
import { IDBUser, IUser } from '../../../../types/user';

export async function getUser(ctx: IRequestContext, userId: string): Promise<IUser> {
  const query = knex('core$.user').select().where({ id_user: userId }).toSQL().toNative();

  const user = await DB.execute<IDBUser>(ctx.log, query.sql, query.bindings);
  return decodeDBUser(user);
}
