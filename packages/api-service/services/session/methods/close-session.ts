import { IRequestContext } from '../../../types/app';
import { ISession } from '../../../types/session';
import { SessionGateway } from '../gateway';

export async function closeSession(ctx: IRequestContext, sessionId: string): Promise<ISession> {
  return SessionGateway.close(ctx, sessionId);
}
