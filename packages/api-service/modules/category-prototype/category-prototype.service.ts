import { CategoryPrototypeService, ICategoryPrototype } from './types';
import { IRequestContext } from '../../types/app';
import { NotFoundError } from '../../libs/errors';
import { categoryPrototypeMapper } from './category-prototype.mapper';
import { categoryPrototypeRepository } from './category-prototype.repository';

class CategoryPrototypeServiceIml implements CategoryPrototypeService {
  async getCategoryPrototype(ctx: IRequestContext, categoryPrototypeId: string): Promise<ICategoryPrototype> {
    const categoryPrototypeDAO = await categoryPrototypeRepository.getCategoryPrototype(ctx, categoryPrototypeId);

    if (!categoryPrototypeDAO) {
      throw new NotFoundError('CategoryPrototype not found');
    }

    return categoryPrototypeMapper.toDomain(categoryPrototypeDAO);
  }

  async getCategoryPrototypes(ctx: IRequestContext<unknown, true>): Promise<ICategoryPrototype[]> {
    const categoryPrototypeDAOs = await categoryPrototypeRepository.getCategoryPrototypes(ctx);

    return categoryPrototypeDAOs.map(categoryPrototypeMapper.toDomain);
  }
}

export const categoryPrototypeService = new CategoryPrototypeServiceIml();
