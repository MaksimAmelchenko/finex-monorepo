import { IRequestContext } from '../../../types/app';
import { NotFoundError } from '../../../libs/errors';
import { Project } from '../model/project';
import { ProjectGateway } from '../gateway';

export async function getProject(ctx: IRequestContext, projectId: string, userId: string): Promise<Project> {
  const project: Project | undefined = await ProjectGateway.getProject(ctx, projectId, userId);
  if (!project) {
    throw new NotFoundError('Project not found');
  }
  return project;
}
