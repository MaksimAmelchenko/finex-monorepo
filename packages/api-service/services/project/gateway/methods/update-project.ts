import { IRequestContext } from '../../../../types/app';
import { Project } from '../../model/project';
import { UpdateProjectGatewayChanges } from '../../types';

export async function updateProject(
  ctx: IRequestContext,
  projectId: string,
  changes: UpdateProjectGatewayChanges
): Promise<Project> {
  ctx.log.trace({ changes }, 'try to update project');
  const { name, note } = changes;

  const project = await Project.query(ctx.trx).patchAndFetchById(Number(projectId), {
    name,
    note,
  });

  ctx.log.info({ projectId }, 'updated project');
  return project;
}
