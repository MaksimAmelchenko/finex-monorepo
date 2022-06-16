import { IRequestContext } from '../../../types/app';
import { CategoryGateway } from '../gateway';
import { getCategory } from './get-category';
import { AccessDeniedError } from '../../../libs/errors';

export async function deleteCategory(ctx: IRequestContext, projectId: string, categoryId: string): Promise<void> {
  const category = await getCategory(ctx, projectId, categoryId);

  if (category.isSystem) {
    throw new AccessDeniedError();
  }

  return CategoryGateway.deleteCategory(ctx, projectId, categoryId);
}
