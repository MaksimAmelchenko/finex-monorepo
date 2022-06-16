import { AccessDeniedError, InvalidParametersError } from '../../../libs/errors';
import { IRequestContext, Permit } from '../../../types/app';
import { ProjectGateway } from '../gateway';
import { getProject } from './get-project';

export async function deleteProject(ctx: IRequestContext, projectId: string): Promise<void> {
  if (ctx.projectId === projectId) {
    throw new InvalidParametersError("Can't delete the current project", { code: 'projectIsCurrent' });
  }
  const project = await getProject(ctx, projectId);

  if (project.permit !== Permit.Owner) {
    throw new AccessDeniedError();
  }

  return ProjectGateway.deleteProject(ctx, projectId);
}
