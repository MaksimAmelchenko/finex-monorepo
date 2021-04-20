import { IRequestContext } from '../../../../types/app';
import dbRequest from '../../../../libs/db-request';
import { decodeDBProject } from './decode-db-project';
import { ICreateParams, IDBProject, IProject } from '../../../../types/project';

export async function createProject(ctx: IRequestContext, params: ICreateParams): Promise<IProject> {
  // const query = knex('cf$.project').insert(params).returning('*').toSQL().toNative();
  // return DB.execute<IDBProject>(ctx.log, query.sql, query.bindings).then(decodeDBProject);

  return dbRequest<{ project: IDBProject }>(ctx, 'cf.project.create', params).then(({ project }) =>
    decodeDBProject(project)
  );
}
