import { IRequestContext } from '../../../../types/app';
import { Tag } from '../../model/tag';

export async function getTag(ctx: IRequestContext, projectId: string, tagId: string): Promise<Tag | undefined> {
  ctx.log.trace('try to get tag');
  return Tag.query(ctx.trx).findById([Number(projectId), Number(tagId)]);
}
