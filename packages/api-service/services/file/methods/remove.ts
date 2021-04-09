import { IRequestContext } from '../../../types/app';
import { IFile } from '../../../types/file';
import getFile from './get';
import { FileGateway } from '../gateway';
import { NotFoundError } from '../../../libs/errors';
import removeContent from './remove-content';

export default async function remove(ctx: IRequestContext, projectId: number, fileId: number): Promise<IFile> {
  const file: IFile | null = await getFile(ctx, projectId, fileId);

  if (!file) {
    throw new NotFoundError('File not found');
  }

  // if ((file.metadata.permit & App.Permit.Delete) !== App.Permit.Delete) {
  //   throw new AccessDeniedError();
  // }

  const [deletedFile] = await Promise.all([
    FileGateway.remove(ctx, projectId, fileId),
    removeContent(ctx, projectId, fileId),
  ]);

  return deletedFile;
}
