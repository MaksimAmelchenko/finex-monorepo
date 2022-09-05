import { CategoryService } from '../../../../services/category';
import { IRequestContext } from '../../../../types/app';
import { IResponse } from '../../../../libs/rest-api/types';

export async function handler(
  ctx: IRequestContext<{ categoryId: string; categoryIdTo: string; isRecursive: boolean }, true>
): Promise<IResponse<{ count: number }>> {
  const { projectId, params } = ctx;

  const { count } = await CategoryService.moveCategory(ctx, projectId, params);

  return {
    body: {
      count,
    },
  };
}
