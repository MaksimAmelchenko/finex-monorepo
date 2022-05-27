import { CategoryService } from '../../../../services/category';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(
  ctx: IRequestContext<{ categoryId: string; categoryIdTo: string; isRecursive: boolean }>
): Promise<IResponse<{ count: number }>> {
  const { categoryId, categoryIdTo, isRecursive } = ctx.params;

  const { count } = await CategoryService.moveCategory(ctx, { categoryId, categoryIdTo, isRecursive });

  return {
    body: {
      count,
    },
  };
}
