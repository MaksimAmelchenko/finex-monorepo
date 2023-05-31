import { Category } from '../../model/category';
import { IRequestContext } from '../../../../types/app';

export async function getCategoriesByPrototype(
  ctx: IRequestContext,
  projectId: string,
  categoryPrototypeId: string
): Promise<Category[]> {
  ctx.log.trace({ categoryPrototypeId }, 'try to get categories by prototype');

  return Category.query(ctx.trx).where({
    idProject: Number(projectId),
    idCategoryPrototype: Number(categoryPrototypeId),
  });
}
