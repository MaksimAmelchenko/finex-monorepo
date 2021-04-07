import { IRequestContext } from '../../../types/app';
import { ICreateParams, IFile } from '../../../types/file';
import { FileGateway } from '../gateway';

export default async function create(ctx: IRequestContext, projectId: number, params: ICreateParams): Promise<IFile> {
  const { name, contentType, size } = params;

  return FileGateway.create(ctx, projectId, {
    name,
    contentType,
    size,
  });
}
