import { IRequestContext } from '../../../types/app';
import { Session } from '../model/session';
import { SessionGateway } from '../gateway';
import { UnauthorizedError } from '../../../libs/errors';

export async function getSession(ctx: IRequestContext, sessionId: string): Promise<Session> {
  const session: Session | undefined = await SessionGateway.getSession(ctx, sessionId);
  if (!session) {
    throw new UnauthorizedError('Session not found', { code: 'sessionNotFound' });
  }
  return session;
}
