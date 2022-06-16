import { AccessDeniedError } from '../../../libs/errors';
import { CategoryGateway } from '../gateway';
import { IRequestContext } from '../../../types/app';
import { UpdateCategoryServiceChanges, UpdateCategoryServiceResponse } from '../types';
import { getCategory } from './get-category';

export async function updateCategory(
  ctx: IRequestContext,
  projectId: string,
  categoryId: string,
  changes: UpdateCategoryServiceChanges
): Promise<UpdateCategoryServiceResponse> {
  const category = await getCategory(ctx, projectId, categoryId);

  if (category.isSystem) {
    throw new AccessDeniedError();
  }

  return CategoryGateway.updateCategory(ctx, projectId, categoryId, changes);
}
