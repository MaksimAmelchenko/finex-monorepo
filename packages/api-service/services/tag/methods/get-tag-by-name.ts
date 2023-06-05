import { IRequestContext } from '../../../types/app';
import { ITag } from '../types';
import { TagGateway } from '../gateway';
import { tagMapper } from '../tag.mapper';

export async function getTagByName(ctx: IRequestContext, projectId: string, name: string): Promise<ITag | undefined> {
  const tagDAO = await TagGateway.getTagByName(ctx, projectId, name);
  if (!tagDAO) {
    return undefined;
  }
  return tagMapper.toDomain(tagDAO);
}
