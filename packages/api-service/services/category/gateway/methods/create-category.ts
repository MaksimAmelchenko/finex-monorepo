import { Category } from '../../model/category';
import { CreateCategoryGatewayData, CreateCategoryGatewayResponse } from '../../types';
import { IRequestContext } from '../../../../types/app';

export async function createCategory(
  ctx: IRequestContext,
  projectId: string,
  userId: string,
  data: CreateCategoryGatewayData
): Promise<CreateCategoryGatewayResponse> {
  ctx.log.trace({ data }, 'try to create category');

  const { name, parent, categoryPrototypeId, isEnabled, note } = data;

  const category = await Category.query(ctx.trx).insertAndFetch({
    idProject: Number(projectId),
    idUser: Number(userId),
    name,
    parent: parent ? Number(parent) : null,
    idCategoryPrototype: categoryPrototypeId ? Number(categoryPrototypeId) : null,
    isEnabled,
    isSystem: false,
    note,
  });

  ctx.log.info({ categoryId: category.idCategory }, 'created category');

  return category;
}
