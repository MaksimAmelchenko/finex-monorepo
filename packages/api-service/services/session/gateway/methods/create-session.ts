import * as uuid from 'uuid';
import { IRequestContext } from '../../../../types/app';
import { IGatewayCreateParams, ISession } from '../../../../types/session';
import { DB, knex } from '../../../../libs/db';
import { decodeDBSession } from './decode-db-session';

export async function createSession(
  ctx: IRequestContext<any, false>,
  userId: number,
  params: IGatewayCreateParams
): Promise<ISession> {
  const {
    additionalParams: { ip },
  } = ctx;

  const { timeout, userAgent, projectId } = params;
  const sessionId: string = uuid.v4();
  const query = knex('core$.session')
    .insert({
      id: sessionId,
      id_user: userId,
      ip,
      id_project: projectId,
      user_agent: userAgent,
      timeout,
      // is_active: true,
      requests_count: 1,
    })
    .returning('*')
    .toSQL()
    .toNative();

  const result: any = await DB.execute(ctx.log, query.sql, query.bindings);
  return decodeDBSession(result);
}
