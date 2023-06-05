import { TagDAO } from '../../model/tag-dao';
import { IRequestContext } from '../../../../types/app';
import { ITagDAO, UpdateTagGatewayChanges } from '../../types';

export async function updateTag(
  ctx: IRequestContext,
  projectId: string,
  tagId: string,
  changes: UpdateTagGatewayChanges
): Promise<ITagDAO> {
  ctx.log.trace({ projectId, tagId, changes }, 'try to update tag');

  const tag = await TagDAO.query(ctx.trx).patchAndFetchById([Number(projectId), Number(tagId)], changes);

  ctx.log.info({ tagId }, 'updated tag');
  return tag;
}
