import { IRequestContext } from '../../../../types/app';
import { ICreateParams, IFile } from '../../../../types/file';
import { DB, knex } from '../../../../libs/db';
import decodeDbFile from './decode-db-file';

export default async function create(ctx: IRequestContext, projectId: number, params: ICreateParams): Promise<IFile> {
  const { name, contentType, size } = params;
  const { userId } = ctx;

  const query = knex('core$.file')
    .insert({
      id_project: projectId,
      id_user: userId,
      name,
      contentType,
      size,
    })
    .returning('*')
    .toSQL()
    .toNative();

  const result: any = await DB.execute(ctx.log, query.sql, query.bindings);
  return decodeDbFile(result);
}
