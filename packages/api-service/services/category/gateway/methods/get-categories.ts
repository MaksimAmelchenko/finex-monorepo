import dbRequest from '../../../../libs/db-request';
import { ICategory } from '../../types';
import { IRequestContext } from '../../../../types/app';
import { decodeCategory } from './decode-category';

export async function getCategories(ctx: IRequestContext): Promise<ICategory[]> {
  ctx.log.trace('try to get categories');

  const { categories } = await dbRequest(ctx, 'cf.category.get', {});

  return categories.map(decodeCategory);
}
