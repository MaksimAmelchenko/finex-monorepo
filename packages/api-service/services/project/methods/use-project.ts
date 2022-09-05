import { IRequestContext } from '../../../types/app';
import { SessionService } from '../../session';
import { getProject } from './get-project';

export async function useProject(ctx: IRequestContext<never, true>, projectId: string): Promise<any> {
  const { sessionId, userId } = ctx;

  await getProject(ctx, projectId, userId);

  await SessionService.updateSession(ctx, sessionId, { projectId });
}
