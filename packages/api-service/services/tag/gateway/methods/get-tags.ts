import { IRequestContext } from '../../../../types/app';
import { TagDAO } from '../../model/tag-dao';
import { ITagDAO } from '../../types';

export async function getTags(ctx: IRequestContext, projectId: string): Promise<ITagDAO[]> {
  ctx.log.trace('try to get tags');
  return TagDAO.query(ctx.trx).where({
    idProject: Number(projectId),
  });
}
