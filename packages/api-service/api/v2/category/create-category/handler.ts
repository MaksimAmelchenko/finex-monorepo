import { CategoryService } from '../../../../services/category';
import { CreateCategoryServiceData, IPublicCategory } from '../../../../services/category/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(
  ctx: IRequestContext<CreateCategoryServiceData>
): Promise<IResponse<{ category: IPublicCategory }>> {
  const { params } = ctx;
  const category = await CategoryService.createCategory(ctx, params);

  return {
    body: {
      category,
    },
  };
}
