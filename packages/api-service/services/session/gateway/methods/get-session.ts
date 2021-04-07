import { IRequestContext } from '../../../../types/app';
import { ISession } from '../../../../types/session';
import { DB, knex } from '../../../../libs/db';
import { decodeDBSession } from './decode-db-session';

export async function getSession(ctx: IRequestContext, sessionId: string): Promise<ISession | null> {
  const query = knex
    .select('*')
    .from('core$.session')
    .where(knex.raw('id = ?', [sessionId]))
    .toSQL()
    .toNative();

  const result: any = await DB.execute(ctx.log, query.sql, query.bindings);

  if (!result) {
    return null;
  }

  return decodeDBSession(result);
}
