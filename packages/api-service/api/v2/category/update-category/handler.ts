import { CategoryService } from '../../../../services/category';
import { IPublicCategory, UpdateCategoryServiceChanges } from '../../../../services/category/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(
  ctx: IRequestContext<UpdateCategoryServiceChanges & { categoryId: string }, true>
): Promise<IResponse<{ category: IPublicCategory }>> {
  const {
    projectId,
    params: { categoryId, ...changes },
  } = ctx;
  const category = await CategoryService.updateCategory(ctx, projectId, categoryId, changes);

  return {
    body: {
      category: category.toPublicModel(),
    },
  };
}
