import { Tag } from '../model/tag';
import { TagGateway } from '../gateway';
import { IRequestContext } from '../../../types/app';

export async function getTags(ctx: IRequestContext, projectId: string): Promise<Tag[]> {
  return TagGateway.getTags(ctx, projectId);
}
