import { Category } from '../../model/category';
import { IRequestContext } from '../../../../types/app';

export async function getCategoryByPrototype(
  ctx: IRequestContext,
  projectId: string,
  categoryPrototypeId: string
): Promise<Category | undefined> {
  ctx.log.trace({ categoryPrototypeId }, 'try to get category');

  const [category] = await Category.query(ctx.trx).where({
    idProject: Number(projectId),
    idCategoryPrototype: Number(categoryPrototypeId),
  });

  return category;
}
