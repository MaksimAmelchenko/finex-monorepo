import { IRequestContext } from '../../../../types/app';
import { IFile } from '../../../../types/file';
import { DB, knex } from '../../../../libs/db';
import decodeDbFile from './decode-db-file';

export default async function get(ctx: IRequestContext, projectId: number, fileId: number): Promise<IFile> {
  const query = knex
    .select('*')
    .from('core$.file')
    .where({
      id_project: projectId,
      id_file: fileId,
    })
    .toSQL()
    .toNative();

  const file: IFile = await DB.execute(ctx.log, query.sql, query.bindings);
  return decodeDbFile(file);
}
