import { IRequestContext } from '../../../../types/app';
import { Category } from '../../model/category';

export async function getCategories(ctx: IRequestContext, projectId: string): Promise<Category[]> {
  ctx.log.trace('try to get categories');

  return Category.query(ctx.trx).where({
    idProject: Number(projectId),
  });
}
