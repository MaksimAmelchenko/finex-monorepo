import { Category } from '../model/category';
import { CategoryGateway } from '../gateway';
import { IRequestContext } from '../../../types/app';

export async function getCategories(ctx: IRequestContext, projectId: string): Promise<Category[]> {
  return CategoryGateway.getCategories(ctx, projectId);
}
