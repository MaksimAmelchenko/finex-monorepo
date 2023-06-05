import { IRequestContext } from '../../../../types/app';
import { TagDAO } from '../../model/tag-dao';
import { ITagDAO } from '../../types';

export async function getTagByName(
  ctx: IRequestContext,
  projectId: string,
  name: string
): Promise<ITagDAO | undefined> {
  ctx.log.trace('try to get tag by name');
  return TagDAO.query(ctx.trx).findOne({ idProject: Number(projectId), name });
}
