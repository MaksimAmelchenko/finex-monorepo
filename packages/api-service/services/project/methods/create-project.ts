import { IRequestContext } from '../../../types/app';
import { IProject, ICreateParams } from '../../../types/project';
import { ProjectGateway } from '../gateway';

export async function createProject(ctx: IRequestContext, params: ICreateParams): Promise<IProject> {
  return ProjectGateway.create(ctx, params);
}
