import { IRequestContext } from '../../../types/app';
import { ISession } from '../../../types/session';
import { SessionGateway } from '../gateway';
import { UnauthorizedError } from '../../../libs/errors';

export async function getSession(ctx: IRequestContext, sessionId: string): Promise<ISession> {
  const session: ISession | null = await SessionGateway.getSession(ctx, sessionId);
  if (!session) {
    throw new UnauthorizedError('Session not found');
  }
  return session;
}
