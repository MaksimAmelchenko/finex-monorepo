import { TagGateway } from '../gateway';
import { IRequestContext } from '../../../types/app';
import { tagMapper } from '../tag.mapper';
import { ITag } from '../types';

export async function getTags(ctx: IRequestContext, projectId: string): Promise<ITag[]> {
  const tagDAOs = await TagGateway.getTags(ctx, projectId);
  return tagDAOs.map(tagDAO => tagMapper.toDomain(tagDAO));
}
