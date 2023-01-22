import * as uuid from 'uuid';

import { CreateSessionGatewayData } from '../../types';
import { IRequestContext } from '../../../../types/app';
import { Session } from '../../model/session';

export async function createSession(
  ctx: IRequestContext,
  userId: string,
  data: CreateSessionGatewayData
): Promise<Session> {
  ctx.log.trace({ data }, 'try to create session');

  const { timeout, userAgent, ip, projectId, accessUntil } = data;
  const sessionId: string = uuid.v4();

  const session = await Session.query(ctx.trx).insertAndFetch({
    id: sessionId,
    idUser: Number(userId),
    idProject: Number(projectId),
    isActive: true,
    ip,
    requestsCount: 1,
    timeout,
    userAgent,
    lastAccessTime: new Date().toISOString(),
    accessUntil,
  });

  ctx.log.info({ sessionId }, 'created session');
  return session;
}
