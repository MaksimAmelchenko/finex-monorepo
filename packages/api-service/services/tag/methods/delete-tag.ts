import { TagGateway } from '../gateway';
import { IRequestContext } from '../../../types/app';
import { NotFoundError } from '../../../libs/errors';

export async function deleteTag(ctx: IRequestContext, projectId: string, tagId: string): Promise<void> {
  const tag = await TagGateway.getTag(ctx, projectId, tagId);
  if (!tag) {
    throw new NotFoundError('Tag is not found');
  }
  return TagGateway.deleteTag(ctx, projectId, tagId);
}
