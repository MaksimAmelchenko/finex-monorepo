import * as moment from 'moment';

import { IJwtPayload } from '../../services/session/types';
import { IRequestContext } from '../../types/app';
import { Session } from '../../services/session/model/session';
import { SessionService } from '../../services/session';
import { UnauthorizedError } from '../errors';
import { resolveAuthorizationHeader } from './resolve-authorization-header';
import { signOutRouteOptions } from '../../api/v2/auth/sign-out';
import { AccountGateway } from '../../services/account/gateway';
import { ProjectGateway } from '../../services/project/gateway';

const notUpdateAccessTimeRoutes: string[] = [signOutRouteOptions.uri];

export async function authorize(
  ctx: IRequestContext<unknown, true>,
  authorizationHeader: string,
  url: string
): Promise<void> {
  const token = resolveAuthorizationHeader(authorizationHeader);

  let sessionId: string;
  try {
    const payload: IJwtPayload = SessionService.verifyJwt(token);
    sessionId = payload.sessionId;
  } catch (err) {
    throw new UnauthorizedError({ code: 'jsonWebTokenError' });
  }
  const session: Session = await SessionService.getSession(ctx, sessionId);

  if (signOutRouteOptions.uri !== url) {
    if (!session.isActive) {
      throw new UnauthorizedError('Session is closed', { code: 'sessionClosed' });
    }
    if (moment.utc() > moment.utc(session.lastAccessTime).add(moment.duration(session.timeout))) {
      await SessionService.closeSession(ctx, sessionId);
      throw new UnauthorizedError('Session Timeout', { code: 'sessionTimeout' });
    }
  }

  const isUpdateAccessTime = !notUpdateAccessTimeRoutes.includes(url);
  await Promise.all<any>([isUpdateAccessTime ? SessionService.updateSessionAccessTime(ctx, session.id) : null]);

  ctx.sessionId = session.id;
  ctx.userId = String(session.idUser);
  ctx.projectId = String(session.idProject);
  ctx.accessUntil = session.accessUntil;

  const [accountPermits, projectPermits] = await Promise.all([
    //
    AccountGateway.getAccountPermits(ctx, ctx.projectId, ctx.userId),
    ProjectGateway.getProjectPermits(ctx, ctx.userId),
  ]);

  ctx.permissions = {
    accounts: accountPermits.reduce((acc, { accountId, permit }) => {
      acc[accountId] = permit;
      return acc;
    }, {}),
    projects: projectPermits.reduce((acc, { projectId, permit }) => {
      acc[projectId] = permit;
      return acc;
    }, {}),
  };

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
