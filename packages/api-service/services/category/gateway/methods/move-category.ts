import dbRequest from '../../../../libs/db-request';
import { IRequestContext } from '../../../../types/app';
import { MoveCategoryGatewayParams, MoveCategoryGatewayResponse } from '../../types';

export async function moveCategory(
  ctx: IRequestContext,
  params: MoveCategoryGatewayParams
): Promise<MoveCategoryGatewayResponse> {
  ctx.log.trace({ params }, 'try to move transactions');
  const { categoryId, categoryIdTo, isRecursive } = params;

  const { count } = await dbRequest(ctx, 'cf.category.move', {
    idCategory: Number(categoryId),
    idCategoryTo: Number(categoryIdTo),
    isRecursive,
  });

  ctx.log.info({ count }, 'transaction are moved ');

  return { count };
}
