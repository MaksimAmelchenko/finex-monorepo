import { Tag } from '../model/tag';
import { TagGateway } from '../gateway';
import { IRequestContext } from '../../../types/app';
import { UpdateTagServiceChanges } from '../types';
import { NotFoundError } from '../../../libs/errors';

export async function updateTag(
  ctx: IRequestContext,
  projectId: string,
  tagId: string,
  changes: UpdateTagServiceChanges
): Promise<Tag> {
  const tag = await TagGateway.getTag(ctx, projectId, tagId);
  if (!tag) {
    throw new NotFoundError('Tag is not found');
  }
  return TagGateway.updateTag(ctx, projectId, tagId, changes);
}
