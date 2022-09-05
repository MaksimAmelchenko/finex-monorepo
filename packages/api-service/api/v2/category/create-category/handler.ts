import { CategoryService } from '../../../../services/category';
import { CreateCategoryServiceData, IPublicCategory } from '../../../../services/category/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(
  ctx: IRequestContext<CreateCategoryServiceData, true>
): Promise<IResponse<{ category: IPublicCategory }>> {
  const { projectId, userId, params } = ctx;
  const category = await CategoryService.createCategory(ctx, projectId, userId, params);

  return {
    body: {
      category: category.toPublicModel(),
    },
  };
}
