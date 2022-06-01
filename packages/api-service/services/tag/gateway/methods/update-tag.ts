import { Tag } from '../../model/tag';
import { IRequestContext } from '../../../../types/app';
import { UpdateTagGatewayChanges } from '../../types';

export async function updateTag(
  ctx: IRequestContext,
  projectId: string,
  tagId: string,
  changes: UpdateTagGatewayChanges
): Promise<Tag> {
  ctx.log.trace({ projectId, tagId, changes }, 'try to update tag');

  const tag = await Tag.query(ctx.trx).patchAndFetchById([Number(projectId), Number(tagId)], changes);

  ctx.log.info({ tagId }, 'updated tag');
  return tag;
}
