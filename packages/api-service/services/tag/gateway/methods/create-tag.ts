import { TagDAO } from '../../model/tag-dao';
import { IRequestContext } from '../../../../types/app';
import { CreateTagGatewayData, ITagDAO } from '../../types';

export async function createTag(
  ctx: IRequestContext,
  projectId: string,
  userId: string,
  data: CreateTagGatewayData
): Promise<ITagDAO> {
  ctx.log.trace({ data }, 'try to create tag');

  const tag = await TagDAO.query(ctx.trx).insertAndFetch({
    idProject: Number(projectId),
    idUser: Number(userId),
    ...data,
  });

  ctx.log.info({ tagId: tag.idTag }, 'created tag');
  return tag;
}
