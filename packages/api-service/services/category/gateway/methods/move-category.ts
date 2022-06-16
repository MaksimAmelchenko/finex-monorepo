import { Category } from '../../model/category';
import { IRequestContext } from '../../../../types/app';
import { MoveCategoryGatewayParams, MoveCategoryGatewayResponse } from '../../types';

export async function moveCategory(
  ctx: IRequestContext,
  projectId: string,
  params: MoveCategoryGatewayParams
): Promise<MoveCategoryGatewayResponse> {
  ctx.log.trace({ params }, 'try to move transactions');
  const { categoryId, categoryIdTo, isRecursive } = params;

  const knex = Category.knex();
  const {
    rows: [{ count }],
  } = await knex
    .raw(
      `
          with recursive
            ct (id_category, parent) as (select c.id_category,
                                                c.parent
                                           from cf$.category c
                                          where c.id_project = :id_project
                                            and c.id_category = :id_category_from
                                          union all
                                         select c.id_category,
                                                c.parent
                                           from ct,
                                                cf$.category c
                                          where c.id_project = :id_project
                                            and c.parent = ct.id_category
                                            and :is_recursive = true),
            u as (
              update cf$.cashflow_detail cfd
                set id_category = :id_category_to
                where cfd.id_project = :id_project
                  and cfd.id_category in (select ct.id_category from ct)
                  and cf$_account.get_permit(cfd.id_project, cfd.id_account) & 3 = 3
                returning *)
        select count(*)
          from u;
      `,
      {
        id_project: Number(projectId),
        id_category_from: Number(categoryId),
        id_category_to: Number(categoryIdTo),
        is_recursive: isRecursive,
      }
    )
    .transacting(ctx.trx);

  ctx.log.info({ count }, 'transaction are moved ');

  return { count };
}
