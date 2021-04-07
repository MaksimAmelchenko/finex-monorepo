import { IRequestContext } from '../../../../types/app';
import { ISession } from '../../../../types/session';
import { DB } from '../../../../libs/db';
import { decodeDBSession } from './decode-db-session';

export async function closeSession(ctx: IRequestContext, sessionId: string): Promise<ISession> {
  const sqlText = `
    update core$.session
       set is_active = false
     where id = $1
     returning *
  `;

  const result: any = await DB.execute(ctx.log, sqlText, [sessionId]);
  return decodeDBSession(result);
}
