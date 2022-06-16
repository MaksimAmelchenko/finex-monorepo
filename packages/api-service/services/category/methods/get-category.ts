import { Category } from '../model/category';
import { CategoryGateway } from '../gateway';
import { IRequestContext } from '../../../types/app';
import { NotFoundError } from '../../../libs/errors';

export async function getCategory(ctx: IRequestContext, projectId: string, categoryId: string): Promise<Category> {
  const category: Category | undefined = await CategoryGateway.getCategory(ctx, projectId, categoryId);
  if (!category) {
    throw new NotFoundError('Category not found');
  }
  return category;
}
