import dbRequest from '../../../../libs/db-request';
import { IPublicProject } from '../../../../services/project/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { ProjectService } from '../../../../services/project';

export async function handler(ctx: IRequestContext<any, true>): Promise<IResponse<{ project: IPublicProject }>> {
  const {
    params: { projectId, name },
    userId,
  } = ctx;
  const {
    project: { idProject },
  } = await dbRequest(ctx, 'cf.project.copy', {
    idProject: Number(projectId),
    name,
  });

  const project = await ProjectService.getProject(ctx, String(idProject), userId);
  return {
    body: {
      project: project.toPublicModel(),
    },
  };
}
