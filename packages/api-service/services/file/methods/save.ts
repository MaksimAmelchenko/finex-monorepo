import { IRequestContext } from '../../../types/app';
import { ISaveParams, IFile } from '../../../types/file';
import createFile from './create'; // tslint:disable-line:import-name
import uploadContent from './upload-content';

export default async function safe(ctx: IRequestContext, projectId: number, params: ISaveParams): Promise<IFile> {
  const { name, contentType, size, content } = params;

  const file: IFile = await createFile(ctx, projectId, {
    name,
    contentType,
    size,
  });

  await uploadContent(ctx, projectId, file.id, content);

  return file;
}
