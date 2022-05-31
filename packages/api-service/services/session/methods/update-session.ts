import { IRequestContext } from '../../../types/app';
import { ISession } from '../../../types/session';
import { SessionGateway } from '../gateway';

export async function updateSession(ctx: IRequestContext, sessionId: string, data: any): Promise<ISession> {
  return SessionGateway.updateSession(ctx, sessionId, data);
}
