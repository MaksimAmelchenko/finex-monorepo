import { IPublicProject, UpdateProjectServiceChanges } from '../../../../services/project/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { ProjectService } from '../../../../services/project';

export async function handler(
  ctx: IRequestContext<UpdateProjectServiceChanges & { projectId: string }>
): Promise<IResponse<{ project: IPublicProject }>> {
  const { projectId, ...changes } = ctx.params;
  const project = await ProjectService.updateProject(ctx, projectId, changes);

  return {
    body: {
      project: project.toPublicModel(),
    },
  };
}
