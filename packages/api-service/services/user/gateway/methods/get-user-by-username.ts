import { IRequestContext } from '../../../../types/app';
import { IDBUser, IUser } from '../../../../types/user';
import { DB, knex } from '../../../../libs/db';
import { decodeDBUser } from './decode-db-user';

export async function getUserByUsername(ctx: IRequestContext, username: string): Promise<IUser | undefined> {
  const query = knex
    .select('*')
    .from('core$.user')
    .where(knex.raw('upper(email) = ?', [username.trim().toUpperCase()]))
    .toSQL()
    .toNative();

  const user: IDBUser | undefined = await DB.execute(ctx.log, query.sql, query.bindings);

  if (!user) {
    return undefined;
  }
  return decodeDBUser(user);
}
