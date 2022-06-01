import { Tag } from '../../model/tag';
import { IRequestContext } from '../../../../types/app';
import { CreateTagGatewayData } from '../../types';

export async function createTag(
  ctx: IRequestContext,
  projectId: string,
  userId: string,
  data: CreateTagGatewayData
): Promise<Tag> {
  ctx.log.trace({ data }, 'try to create tag');

  const tag = await Tag.query(ctx.trx).insertAndFetch({
    idProject: Number(projectId),
    idUser: Number(userId),
    ...data,
  });

  ctx.log.info({ tagId: tag.idTag }, 'created tag');
  return tag;
}
