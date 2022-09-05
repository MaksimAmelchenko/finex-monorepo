import { IRequestContext } from '../../../types/app';
import { IFile, ISaveParams } from '../../../types/file';
import createFile from './create';
import uploadContent from './upload-content';

export default async function safe(
  ctx: IRequestContext<any, true>,
  projectId: number,
  params: ISaveParams
): Promise<IFile> {
  const { name, contentType, size, content } = params;

  const file: IFile = await createFile(ctx, projectId, {
    name,
    contentType,
    size,
  });

  await uploadContent(ctx, projectId, file.id, content);

  return file;
}
