import { IRequestContext } from '../../../../types/app';
import { ISession } from '../../../../types/session';
import { DB, knex } from '../../../../libs/db';
import { decodeDBSession } from './decode-db-session';

export async function updateSession(ctx: IRequestContext, sessionId: string, data: any): Promise<ISession> {
  const query = knex('core$.session')
    .where(knex.raw('id = ?', [sessionId]))
    .update(data)
    .returning('*')
    .toSQL()
    .toNative();

  const result: any = await DB.execute(ctx.log, query.sql, query.bindings);
  return decodeDBSession(result);
}
