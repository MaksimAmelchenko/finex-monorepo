import { CategoryGateway } from '../gateway';
import { IRequestContext } from '../../../types/app';
import { UpdateCategoryServiceChanges, UpdateCategoryServiceResponse } from '../types';

export async function updateCategory(
  ctx: IRequestContext,
  categoryId: string,
  changes: UpdateCategoryServiceChanges
): Promise<UpdateCategoryServiceResponse> {
  return CategoryGateway.updateCategory(ctx, categoryId, changes);
}
