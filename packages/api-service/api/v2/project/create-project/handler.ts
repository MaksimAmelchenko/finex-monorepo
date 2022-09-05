import { IPublicProject } from '../../../../services/project/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { ProjectService } from '../../../../services/project';

export async function handler(ctx: IRequestContext<any, true>): Promise<IResponse<{ project: IPublicProject }>> {
  const { userId, params } = ctx;
  const project = await ProjectService.createProject(ctx, userId, params);

  return {
    body: {
      project: project.toPublicModel(),
    },
  };
}
