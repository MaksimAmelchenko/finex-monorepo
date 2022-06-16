import { IRequestContext } from '../../../../types/app';
import { Session } from '../../model/session';
import { UpdateSessionGatewayChanges } from '../../types';

export async function updateSession(
  ctx: IRequestContext,
  sessionId: string,
  changes: UpdateSessionGatewayChanges
): Promise<Session> {
  ctx.log.trace({ changes }, 'try to update session');
  const { projectId, ...rest } = changes;

  return Session.query(ctx.trx).patchAndFetchById(sessionId, {
    idProject: projectId ? Number(projectId) : undefined,
    ...rest,
  });
}
