import { AccessDeniedError } from '../../../libs/errors';
import { IRequestContext } from '../../../types/app';
import { Project } from '../model/project';
import { ProjectGateway } from '../gateway';
import { UpdateProjectServiceChanges } from '../types';
import { getProject } from './get-project';

export async function updateProject(
  ctx: IRequestContext,
  projectId: string,
  changes: UpdateProjectServiceChanges
): Promise<Project> {
  const { name, note } = changes;

  // remove the current user from list
  const editors = changes.editors ? changes.editors.filter(idUser => String(idUser) !== ctx.userId) : [];

  const project = await getProject(ctx, projectId);

  if (project.permit !== 7) {
    throw new AccessDeniedError();
  }

  await ProjectGateway.updateProject(ctx, projectId, { name, note });

  const knex = Project.knex();

  if (editors) {
    await knex
      .raw(
        `
          delete
            from cf$.project_permit pp
           where pp.id_project = :id_project
             and pp.permit = 3
             and pp.id_user not in (select jsonb_array_elements_text(:editors)::int);
        `,
        {
          id_project: project.idProject,
          editors: JSON.stringify(editors),
        }
      )
      .transacting(ctx.trx);

    if (editors.length) {
      await knex
        .raw(
          `
            insert into cf$.project_permit ( id_project, id_user, permit )
              (select :id_project, value::int, 3
                 from jsonb_array_elements_text(:editors)
                   except all
               select pp.id_project, pp.id_user, pp.permit
                 from cf$.project_permit pp
                where pp.id_project = :id_project
                  and pp.permit = 3);
          `,
          {
            id_project: project.idProject,
            editors: JSON.stringify(editors),
          }
        )
        .transacting(ctx.trx);
    }
  }

  return getProject(ctx, projectId);
}
