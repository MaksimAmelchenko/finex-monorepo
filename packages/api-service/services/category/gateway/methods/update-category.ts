import { Category } from '../../model/category';
import { ICategory, UpdateCategoryGatewayChanges, UpdateCategoryGatewayResponse } from '../../types';
import { IRequestContext } from '../../../../types/app';
import { InvalidParametersError } from '../../../../libs/errors';
import { Project } from '../../../project/model/project';

export async function updateCategory(
  ctx: IRequestContext,
  projectId: string,
  categoryId: string,
  changes: UpdateCategoryGatewayChanges
): Promise<UpdateCategoryGatewayResponse> {
  ctx.log.trace({ categoryId, changes }, 'try to update category');

  const { name, parent, categoryPrototypeId, isEnabled, note } = changes;

  const params: Partial<ICategory> = {
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

  const knex = Project.knex();
  if (parent) {
    const {
      rows: [{ count }],
    } = await knex
      .raw(
        `
            with
              recursive ct (id_category, parent) as
                          (select c.id_category, c.parent
                             from cf$.category c
                            where c.id_project = :id_project
                              and c.id_category = :id_category
                            union all
                           select c.id_category, c.parent
                             from ct,
                                  cf$.category c
                            where c.id_project = :id_project
                              and c.parent = ct.id_category
                            )
          select count(*)
            from ct
           where ct.id_category = :parent
        `,
        {
          id_project: Number(projectId),
          id_category: Number(categoryId),
          parent: Number(parent),
        }
      )
      .transacting(ctx.trx);

    if (count) {
      throw new InvalidParametersError('There is a cycle in the hierarchy', { code: 'cycleInHierarchy' });
    }
  }

  const category = await Category.query(ctx.trx).patchAndFetchById([Number(projectId), Number(categoryId)], params);

  ctx.log.info({ categoryId }, 'updated category');

  return category;
}
