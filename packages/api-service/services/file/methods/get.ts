import { IRequestContext } from '../../../types/app';
import { IFile } from '../../../types/file';
import { FileGateway } from '../gateway';
import getContent from './get-content';

export default async function get(
  ctx: IRequestContext,
  projectId: number,
  fileId: number,
  isWithContent = false
): Promise<IFile | null> {
  const [file, content] = await Promise.all([
    FileGateway.get(ctx, projectId, fileId),
    isWithContent ? getContent(ctx, projectId, fileId) : null,
  ]);

  if (!file) {
    return null;
  }

  if (content) {
    file.content = content;
  }

  return file;
}
