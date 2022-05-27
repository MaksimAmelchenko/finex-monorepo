import { CategoryService } from '../../../../services/category';
import { IPublicCategory } from '../../../../services/category/types';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(ctx: IRequestContext): Promise<IResponse<{ categories: IPublicCategory[] }>> {
  const categories = await CategoryService.getCategories(ctx);

  return {
    body: {
      categories,
    },
  };
}
