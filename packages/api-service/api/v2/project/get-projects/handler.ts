import { IPublicProject } from '../../../../services/project/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';
import { Project } from '../../../../services/project/model/project';
import { ProjectService } from '../../../../services/project';

export async function handler(ctx: IRequestContext): Promise<IResponse<{ projects: IPublicProject[] }>> {
  const { userId } = ctx;
  const projects: Project[] = await ProjectService.getProjects(ctx, userId);

  return {
    body: {
      projects: projects.map(project => project.toPublicModel()),
    },
  };
}
