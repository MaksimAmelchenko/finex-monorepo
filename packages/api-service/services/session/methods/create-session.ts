import { IRequestContext } from '../../../types/app';
import { ICreateParams, ISession } from '../../../types/session';
import { SessionGateway } from '../gateway';

export async function createSession(
  ctx: IRequestContext<any, false>,
  userId: number,
  params: ICreateParams
): Promise<ISession> {
  const { timeout, projectId, userAgent } = params;
  const session: ISession = await SessionGateway.createSession(ctx, userId, {
    timeout,
    projectId,
    userAgent,
  });

  return session;
}
