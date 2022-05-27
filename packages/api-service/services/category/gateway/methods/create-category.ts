import dbRequest from '../../../../libs/db-request';
import { CreateCategoryGatewayData, CreateCategoryGatewayResponse } from '../../types';
import { IRequestContext } from '../../../../types/app';
import { decodeCategory } from './decode-category';

export async function createCategory(
  ctx: IRequestContext,
  data: CreateCategoryGatewayData
): Promise<CreateCategoryGatewayResponse> {
  ctx.log.trace({ data }, 'try to create category');

  const { name, parent, categoryPrototypeId, isEnabled, note } = data;

  const response = await dbRequest(ctx, 'cf.category.create', {
    name,
    parent: parent ? Number(parent) : null,
    idCategoryPrototype: categoryPrototypeId ? Number(categoryPrototypeId) : null,
    isEnabled,
    note,
  });

  const category = decodeCategory(response.category);

  ctx.log.info({ categoryId: category.id }, 'created category');

  return category;
}
