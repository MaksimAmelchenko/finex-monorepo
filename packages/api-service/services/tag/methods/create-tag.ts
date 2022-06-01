import { Tag } from '../model/tag';
import { TagGateway } from '../gateway';
import { CreateTagServiceData } from '../types';
import { IRequestContext } from '../../../types/app';

export async function createTag(
  ctx: IRequestContext,
  projectId: string,
  userId: string,
  data: CreateTagServiceData
): Promise<Tag> {
  return TagGateway.createTag(ctx, projectId, userId, data);
}
