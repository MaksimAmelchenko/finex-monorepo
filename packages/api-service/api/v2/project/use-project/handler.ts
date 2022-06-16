import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { ProjectService } from '../../../../services/project';
import { SessionService } from '../../../../services/session';

export async function handler(ctx: IRequestContext): Promise<IResponse> {
  const {
    sessionId,
    userId,
    params: { projectId },
  } = ctx;

  await ProjectService.getProject(ctx, projectId);

  await SessionService.updateSession(ctx, sessionId, { projectId });

  const dependencies = await ProjectService.getDependencies(ctx, projectId, userId);
  return {
    body: {
      ...dependencies,
    },
  };
}
