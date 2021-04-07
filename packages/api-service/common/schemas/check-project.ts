import { IRequestContext } from '../../types/app';
import { NotFoundError } from '../../libs/errors';

export default function checkProject(ctx: IRequestContext): void {
  const {
    params: { projectId },
    projects,
  } = ctx;

  if (projects && !projects.includes(projectId)) {
    throw new NotFoundError('Project not found');
  }
}
