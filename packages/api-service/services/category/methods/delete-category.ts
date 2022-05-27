import { IRequestContext } from '../../../types/app';
import { CategoryGateway } from '../gateway';

export async function deleteCategory(ctx: IRequestContext, categoryId: string): Promise<void> {
  return CategoryGateway.deleteCategory(ctx, categoryId);
}
