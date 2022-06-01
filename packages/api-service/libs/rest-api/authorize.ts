import * as moment from 'moment';

import { IRequestContext } from '../../types/app';
import { IJwtPayload, ISession } from '../../types/session';
import { Session } from '../../services/session';
import { UnauthorizedError } from '../errors';
import { signOutRouteOptions } from '../../api/v2/auth/sign-out';
import { resolveAuthorizationHeader } from './resolve-authorization-header';

const notUpdateAccessTimeRoutes: string[] = [signOutRouteOptions.uri];

export async function authorize(ctx: IRequestContext<never>, authorizationHeader: string, url: string): Promise<void> {
  const token = resolveAuthorizationHeader(authorizationHeader);

  let sessionId: string;
  try {
    const payload: IJwtPayload = Session.verifyJwt(token);
    sessionId = payload.sessionId;
  } catch (err) {
    throw new UnauthorizedError({ code: 'jsonWebTokenError' });
  }
  const session: ISession = await Session.getSession(ctx, sessionId);

  if (signOutRouteOptions.uri !== url) {
    if (!session.isActive) {
      throw new UnauthorizedError('Session is closed', { code: 'sessionClosed' });
    }
    if (moment.utc() > moment.utc(session.lastAccessAt).add(moment.duration(session.timeout))) {
      await Session.closeSession(ctx, sessionId);
      throw new UnauthorizedError('Session Timeout', { code: 'sessionTimeout' });
    }
  }

  const isUpdateAccessTime = !notUpdateAccessTimeRoutes.includes(url);
  await Promise.all<any>([isUpdateAccessTime ? Session.updateSessionAccessTime(ctx, session.id) : null]);

  ctx.sessionId = session.id;
  ctx.userId = session.userId;
  ctx.projectId = session.projectId;
  ctx.authorization = token;

  ctx.log = ctx.log.child(
    {
      sessionId: ctx.sessionId,
      projectId: ctx.projectId,
      userId: ctx.userId,
    },
    true
  );
}
