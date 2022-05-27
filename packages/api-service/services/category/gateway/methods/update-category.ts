import dbRequest from '../../../../libs/db-request';
import { IRequestContext } from '../../../../types/app';
import { UpdateCategoryGatewayChanges, UpdateCategoryGatewayResponse } from '../../types';
import { decodeCategory } from './decode-category';
import { skipUndefined } from '../../../../libs/skip-undefined';

export async function updateCategory(
  ctx: IRequestContext,
  categoryId: string,
  changes: UpdateCategoryGatewayChanges
): Promise<UpdateCategoryGatewayResponse> {
  ctx.log.trace({ changes }, 'try to update category');

  const { name, parent, categoryPrototypeId, isEnabled, note } = changes;

  const params: any = {
    idCategory: Number(categoryId),
    name,
    isEnabled,
    note,
  };

  if (parent !== undefined) {
    params.parent = parent ? Number(parent) : null;
  }

  if (categoryPrototypeId !== undefined) {
    params.idCategoryPrototype = categoryPrototypeId ? Number(categoryPrototypeId) : null;
  }

  const response = await dbRequest(ctx, 'cf.category.update', skipUndefined(params));

  const category = decodeCategory(response.category);

  ctx.log.info({ categoryId: category.id }, 'updated category');

  return category;
}
