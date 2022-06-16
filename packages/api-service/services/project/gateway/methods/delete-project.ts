import { Project } from '../../model/project';
import { IRequestContext } from '../../../../types/app';

export async function deleteProject(ctx: IRequestContext, projectId: string): Promise<void> {
  ctx.log.trace({ projectId }, 'try to delete project');
  await Project.query(ctx.trx).deleteById(Number(projectId));
  ctx.log.info({ projectId }, 'deleted project');
}
