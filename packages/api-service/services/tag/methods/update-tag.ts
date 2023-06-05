import { IRequestContext } from '../../../types/app';
import { ITag, UpdateTagServiceChanges } from '../types';
import { NotFoundError } from '../../../libs/errors';
import { TagGateway } from '../gateway';
import { tagMapper } from '../tag.mapper';

export async function updateTag(
  ctx: IRequestContext,
  projectId: string,
  tagId: string,
  changes: UpdateTagServiceChanges
): Promise<ITag> {
  const tag = await TagGateway.getTag(ctx, projectId, tagId);
  if (!tag) {
    throw new NotFoundError('Tag is not found');
  }
  const tagDAO = await TagGateway.updateTag(ctx, projectId, tagId, changes);
  return tagMapper.toDomain(tagDAO);
}
