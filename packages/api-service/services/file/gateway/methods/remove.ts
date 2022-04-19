import { IRequestContext } from '../../../../types/app';
import { DB, knex } from '../../../../libs/db';

import { IFile } from '../../../../types/file';
import decodeDbFile from './decode-db-file';

export default async function remove(ctx: IRequestContext, projectId: number, fileId: number): Promise<IFile> {
  const file = await knex('core$.file')
    .where({
      id_project: projectId,
      id_file: fileId,
    })
    .del()
    .returning('*');

  return decodeDbFile(file);
}
