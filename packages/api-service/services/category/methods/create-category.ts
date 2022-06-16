import { CategoryGateway } from '../gateway';
import { CreateCategoryServiceData, CreateCategoryServiceResponse } from '../types';
import { IRequestContext } from '../../../types/app';

export async function createCategory(
  ctx: IRequestContext,
  projectId: string,
  userId: string,
  data: CreateCategoryServiceData
): Promise<CreateCategoryServiceResponse> {
  return CategoryGateway.createCategory(ctx, projectId, userId, data);
}
