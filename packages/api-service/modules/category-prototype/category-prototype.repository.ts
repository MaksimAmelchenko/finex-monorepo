import { CategoryPrototypeDAO } from './models/category-prototype-dao';
import { ICategoryPrototypeDAO, CategoryPrototypeRepository } from './types';
import { IRequestContext } from '../../types/app';

class CategoryPrototypeRepositoryImpl implements CategoryPrototypeRepository {
  async getCategoryPrototype(
    ctx: IRequestContext,
    categoryPrototypeId: string
  ): Promise<ICategoryPrototypeDAO | undefined> {
    ctx.log.trace({ categoryPrototypeId }, 'try to get category prototype');

    return CategoryPrototypeDAO.query(ctx.trx).findById(Number(categoryPrototypeId));
  }

  async getCategoryPrototypes(ctx: IRequestContext<unknown, true>): Promise<ICategoryPrototypeDAO[]> {
    ctx.log.trace('try to get category prototypes');

    return CategoryPrototypeDAO.query(ctx.trx);
  }
}

export const categoryPrototypeRepository = new CategoryPrototypeRepositoryImpl();
