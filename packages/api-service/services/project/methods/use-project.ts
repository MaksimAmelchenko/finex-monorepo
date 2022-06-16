import { IRequestContext } from '../../../types/app';
import { SessionService } from '../../session';
import { getProject } from './get-project';

export async function useProject(ctx: IRequestContext, projectId: string): Promise<any> {
  const { sessionId } = ctx;

  await getProject(ctx, projectId);

  await SessionService.updateSession(ctx, sessionId, { projectId });
}
