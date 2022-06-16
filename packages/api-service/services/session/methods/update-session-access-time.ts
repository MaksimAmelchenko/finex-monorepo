import { IRequestContext } from '../../../types/app';
import { Session } from '../model/session';
import { SessionGateway } from '../gateway';

export async function updateSessionAccessTime(ctx: IRequestContext, sessionId: string): Promise<Session> {
  return SessionGateway.updateSession(ctx, sessionId, {
    lastAccessTime: new Date().toISOString(),
  });
}
