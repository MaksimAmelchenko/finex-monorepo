import { IRequestContext } from '../../../../types/app';
import { DB } from '../../../../libs/db';
import { decodeDBProject } from './decode-db-project';
import { IDBProject, IProject } from '../../../../types/project';

export async function getAllByUserId(ctx: IRequestContext, userId: number): Promise<IProject[]> {
  const sqlText = `
    select p.id_project as "idProject",
           p.id_user as "idUser",
           p.name,
           p.note,
           7 as permit
      from cf$.project p
     where p.id_user = $1
     union
    select p.id_project,
           p.id_user,
           p.name,
           p.note,
           pp.permit
      from      cf$.project p
           join cf$.project_permit pp
          using (id_project)
     where p.id_user = $1
  `;
  return DB.query<IDBProject>(ctx.log, sqlText, [Number(userId)]).then(projects => {
    console.log(projects);
    return projects.map(decodeDBProject);
  });
}
