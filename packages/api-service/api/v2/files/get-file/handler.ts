import { IRequestContext } from '../../../../types/app';
import { File } from '../../../../services/file';
import { NotFoundError } from '../../../../libs/errors';
import { IDownloadFile, IFile } from '../../../../types/file';

export async function handler(ctx: IRequestContext<any, false>): Promise<IDownloadFile> {
  const { accountId, fileId } = ctx.params;
  const file: IFile | null = await File.get(ctx, accountId, fileId, true);

  if (!file || !file.content) {
    throw new NotFoundError('File not found');
  }

  return {
    filename: file.name,
    contentType: file.contentType,
    content: file.content,
  };
}
