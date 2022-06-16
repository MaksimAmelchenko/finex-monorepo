import { IRequestContext } from '../../../../types/app';
import { Project } from '../../model/project';
import { getProjects } from './get-projects';

export async function getProject(ctx: IRequestContext, projectId: string): Promise<Project | undefined> {
  ctx.log.trace({ projectId }, 'try to get project');
  const { userId } = ctx;
  const projects: Project[] = await getProjects(ctx, userId);
  return projects.find(({ idProject }) => idProject === Number(projectId));
}
