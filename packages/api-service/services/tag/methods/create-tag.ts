import { CreateTagServiceData, ITag } from '../types';
import { IRequestContext } from '../../../types/app';
import { TagGateway } from '../gateway';
import { tagMapper } from '../tag.mapper';

export async function createTag(
  ctx: IRequestContext,
  projectId: string,
  userId: string,
  data: CreateTagServiceData
): Promise<ITag> {
  const tagDAO = await TagGateway.createTag(ctx, projectId, userId, data);
  return tagMapper.toDomain(tagDAO);
}
