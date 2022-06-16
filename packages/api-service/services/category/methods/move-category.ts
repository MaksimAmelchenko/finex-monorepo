import { CategoryGateway } from '../gateway';
import { IRequestContext } from '../../../types/app';
import { InvalidParametersError } from '../../../libs/errors';
import { MoveCategoryServiceParams, MoveCategoryServiceResponse } from '../types';
import { getCategory } from './get-category';

export async function moveCategory(
  ctx: IRequestContext,
  projectId: string,
  params: MoveCategoryServiceParams
): Promise<MoveCategoryServiceResponse> {
  const { categoryId, categoryIdTo, isRecursive } = params;

  await Promise.all([
    //
    getCategory(ctx, projectId, categoryId),
    getCategory(ctx, projectId, categoryIdTo),
  ]);

  if (!isRecursive && categoryId === categoryIdTo) {
    throw new InvalidParametersError('Cannot move a category to the same category without recursion', {
      code: 'sameCategory',
    });
  }

  return CategoryGateway.moveCategory(ctx, projectId, params);
}
