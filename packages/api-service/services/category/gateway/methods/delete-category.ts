import { IRequestContext } from '../../../../types/app';
import { Category } from '../../model/category';

export async function deleteCategory(ctx: IRequestContext, projectId: string, categoryId: string): Promise<void> {
  ctx.log.trace({ categoryId }, 'try to delete category');

  await Category.query(ctx.trx).deleteById([Number(projectId), Number(categoryId)]);

  ctx.log.info({ categoryId }, 'deleted category');
}
