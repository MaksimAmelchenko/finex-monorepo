import { CategoryService } from '../../../../services/category';
import { IPublicCategory, UpdateCategoryServiceChanges } from '../../../../services/category/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(
  ctx: IRequestContext<UpdateCategoryServiceChanges & { categoryId: string }>
): Promise<IResponse<{ category: IPublicCategory }>> {
  const { categoryId, ...changes } = ctx.params;
  const category = await CategoryService.updateCategory(ctx, categoryId, changes);

  return {
    body: {
      category,
    },
  };
}
