import { StatusCodes } from 'http-status-codes';

import { CategoryService } from '../../../../services/category';
import { INoContent } from '../../../../libs/rest-api/types';
import { IRequestContext } from '../../../../types/app';

export async function handler(ctx: IRequestContext<{ categoryId: string }>): Promise<INoContent> {
  const { categoryId } = ctx.params;
  await CategoryService.deleteCategory(ctx, categoryId);

  return {
    status: StatusCodes.NO_CONTENT,
  };
}