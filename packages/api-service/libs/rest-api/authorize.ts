import * as moment from 'moment';
import { IRequestContext } from '../../types/app';
import { IJwtPayload, ISession } from '../../types/session';
import { Session } from '../../services/session';
import { UnauthorizedError } from '../errors';
import { signOutRouteOptions } from '../../api/v2/auth/sign-out';

const notUpdateAccessTimeRoutes: string[] = [signOutRouteOptions.uri];

export async function authorize(ctx: IRequestContext, authorization: string | undefined, url: string): Promise<void> {
  if (!authorization) {
    throw new UnauthorizedError('Authorization header not present');
  }

  let sessionId: string;
  try {
    const payload: IJwtPayload = Session.verifyJwt(authorization);
    sessionId = payload.sessionId;
  } catch (err) {
    throw new UnauthorizedError({ code: 'jsonWebTokenError' });
  }
  const session: ISession = await Session.get(ctx, sessionId);

  if (signOutRouteOptions.uri !== url) {
    if (!session.isActive) {
      throw new UnauthorizedError('Session is closed', { code: 'sessionClosed' });
    }
    if (moment.utc() > moment.utc(session.lastAccessAt).add(moment.duration(session.timeout))) {
      await Session.close(ctx, sessionId);
      throw new UnauthorizedError('Session Timeout', { code: 'sessionTimeout' });
    }
  }

  const isUpdateAccessTime = !notUpdateAccessTimeRoutes.includes(url);
  await Promise.all<any>([isUpdateAccessTime ? Session.updateAccessTime(ctx, session.id) : null]);

  ctx.sessionId = session.id;
  ctx.userId = session.userId;

  ctx.log = ctx.log.child(
    {
      sessionId: ctx.sessionId,
      userId: ctx.userId,
    },
    true
  );
}
