import { IPublicProject, UpdateProjectServiceChanges } from '../../../../services/project/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { ProjectService } from '../../../../services/project';

export async function handler(
  ctx: IRequestContext<UpdateProjectServiceChanges & { projectId: string }, true>
): Promise<IResponse<{ project: IPublicProject }>> {
  const {
    userId,
    params: { projectId, ...changes },
  } = ctx;
  const project = await ProjectService.updateProject(ctx, projectId, userId, changes);

  return {
    body: {
      project: project.toPublicModel(),
    },
  };
}
