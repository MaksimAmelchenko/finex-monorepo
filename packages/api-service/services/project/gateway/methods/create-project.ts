import { CreateProjectGatewayData } from '../../types';
import { IRequestContext } from '../../../../types/app';
import { Project } from '../../model/project';

export async function createProject(
  ctx: IRequestContext,
  userId: string,
  data: CreateProjectGatewayData
): Promise<Project> {
  ctx.log.trace({ data }, 'try to create project');
  const { name, note } = data;

  const project = await Project.query(ctx.trx).insertAndFetch({
    idUser: Number(userId),
    name,
    note,
  });

  ctx.log.info({ projectId: project.idProject }, 'created project');
  return project;
}
