import dbRequest from '../../../../libs/db-request';
import { IRequestContext } from '../../../../types/app';

export async function deleteCategory(ctx: IRequestContext, categoryId: string): Promise<void> {
  ctx.log.trace({ categoryId }, 'try to delete category');

  await dbRequest(ctx, 'cf.category.destroy', {
    idCategory: Number(categoryId),
  });

  ctx.log.info({ categoryId }, 'deleted category');
}
