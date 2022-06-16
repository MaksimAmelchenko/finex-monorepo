import { IRequestContext } from '../../../types/app';
import { Session } from '../model/session';
import { SessionGateway } from '../gateway';
import { UpdateSessionServiceChanges } from '../types';

export async function updateSession(
  ctx: IRequestContext,
  sessionId: string,
  changes: UpdateSessionServiceChanges
): Promise<Session> {
  return SessionGateway.updateSession(ctx, sessionId, changes);
}
