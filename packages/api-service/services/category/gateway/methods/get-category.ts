import { Category } from '../../model/category';
import { IRequestContext } from '../../../../types/app';

export async function getCategory(
  ctx: IRequestContext,
  projectId: string,
  categoryId: string
): Promise<Category | undefined> {
  ctx.log.trace({ categoryId }, 'try to get category');

  return Category.query(ctx.trx).findById([Number(projectId), Number(categoryId)]);
}
