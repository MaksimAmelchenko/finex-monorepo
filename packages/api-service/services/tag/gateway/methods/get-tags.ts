import { IRequestContext } from '../../../../types/app';
import { Tag } from '../../model/tag';

export async function getTags(ctx: IRequestContext, projectId: string): Promise<Tag[]> {
  ctx.log.trace('try to get tags');
  return Tag.query(ctx.trx).where({
    idProject: Number(projectId),
  });
}
