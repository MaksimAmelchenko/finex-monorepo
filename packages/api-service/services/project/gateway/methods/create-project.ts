import { IRequestContext } from '../../../../types/app';
import { DB, knex } from '../../../../libs/db';
import { decodeDBProject } from './decode-db-project';
import { ICreateParams, IDBProject, IProject } from '../../../../types/project';

export async function createProject(ctx: IRequestContext, params: ICreateParams): Promise<IProject> {
  const query = knex('cf$.project').insert(params).returning('*').toSQL().toNative();

  return DB.execute<IDBProject>(ctx.log, query.sql, query.bindings).then(decodeDBProject);
}
