import { IRequestContext } from '../../../../types/app';
import { TagDAO } from '../../model/tag-dao';
import { ITagDAO } from '../../types';

export async function getTag(ctx: IRequestContext, projectId: string, tagId: string): Promise<ITagDAO | undefined> {
  ctx.log.trace('try to get tag');
  return TagDAO.query(ctx.trx).findById([Number(projectId), Number(tagId)]);
}
