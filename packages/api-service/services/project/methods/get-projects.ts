import { IRequestContext } from '../../../types/app';
import { Project } from '../model/project';
import { ProjectGateway } from '../gateway';

export async function getProjects(ctx: IRequestContext, userId: string): Promise<Project[]> {
  return ProjectGateway.getProjects(ctx, userId);
}
