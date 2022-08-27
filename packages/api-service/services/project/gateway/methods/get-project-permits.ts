import { ProjectPermit } from '../../types';
import { IRequestContext } from '../../../../types/app';
import { Project } from '../../model/project';

export async function getProjectPermits(ctx: IRequestContext, userId: string): Promise<ProjectPermit[]> {
  ctx.log.trace('try to get project permits');
  const knex = Project.knex();
  const { rows: projectPermits } = await knex
    .raw(
      `
        select p.id_project as "projectId",
               7 as permit
          from cf$.project p
         where p.id_user = :userId::int
         union all
        select pp.id_project,
               pp.permit
          from cf$.project_permit pp
         where pp.id_user = :userId::int
      `,
      {
        userId: Number(userId),
      }
    )
    .transacting(ctx.trx);

  return projectPermits;
}
