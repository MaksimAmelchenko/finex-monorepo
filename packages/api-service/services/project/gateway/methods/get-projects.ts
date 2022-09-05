import { snakeCaseMappers } from 'objection';

import { IRequestContext } from '../../../../types/app';
import { Project } from '../../model/project';

const { parse } = snakeCaseMappers();

export async function getProjects(ctx: IRequestContext<any, false>, userId: string): Promise<Project[]> {
  ctx.log.trace({ userId }, 'try to get projects');
  const knex = Project.knex();
  let query = knex.raw(
    `
        select p.id_project,
               p.id_user,
               p.name,
               p.note,
               7::smallint as permit,
               array(select pp.id_user
                       from cf$.project_permit pp
                      where pp.id_project = p.id_project
                        and pp.permit = 3) as "editors"
          from cf$.project p
         where p.id_user = :id_user
         union all
        select p.id_project,
               p.id_user,
               p.name,
               p.note,
               pp.permit,
               '{}'::integer[] as editors
          from cf$.project_permit pp
                 join cf$.project p
                      using (id_project)
         where pp.id_user = :id_user
      `,
    {
      id_user: Number(userId),
    }
  );
  if (ctx.trx) {
    query = query.transacting(ctx.trx);
  }

  const { rows: projects } = await query;
  return projects.map(project => Project.fromDatabaseJson(parse(project)));
}
