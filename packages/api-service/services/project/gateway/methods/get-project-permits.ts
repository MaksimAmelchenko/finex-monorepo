import { ProjectPermit } from '../../types';
import { IRequestContext } from '../../../../types/app';
import { Project } from '../../model/project';

export async function getProjectPermits(ctx: IRequestContext<unknown, true>, userId: string): Promise<ProjectPermit[]> {
  ctx.log.trace('try to get project permits');
  const knex = Project.knex();

  let query = knex.raw(
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
  );

  if (ctx.trx) {
    query = query.transacting(ctx.trx);
  }

  const { rows: projectPermits } = await query;
  return projectPermits;
}
