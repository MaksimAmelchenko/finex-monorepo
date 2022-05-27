import { CategoryGateway } from '../gateway';
import { IRequestContext } from '../../../types/app';
import { MoveCategoryServiceParams, MoveCategoryServiceResponse } from '../types';

export async function moveCategory(
  ctx: IRequestContext,
  params: MoveCategoryServiceParams
): Promise<MoveCategoryServiceResponse> {
  return CategoryGateway.moveCategory(ctx, params);
}
