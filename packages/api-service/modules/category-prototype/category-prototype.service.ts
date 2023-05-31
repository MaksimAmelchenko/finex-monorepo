import { CategoryPrototypeService, ICategoryPrototype } from './types';
import { IRequestContext } from '../../types/app';
import { NotFoundError } from '../../libs/errors';
import { categoryPrototypeMapper } from './category-prototype.mapper';
import { categoryPrototypeRepository } from './category-prototype.repository';

class CategoryPrototypeServiceImpl implements CategoryPrototypeService {
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

  // make sure that the category prototypes are sorted by hierarchy
  async getSortedCategoryPrototypes(ctx: IRequestContext<unknown, true>): Promise<ICategoryPrototype[]> {
    const categoryPrototypes = await this.getCategoryPrototypes(ctx);

    const dict: Record<number, ICategoryPrototype[]> = {};

    categoryPrototypes.forEach(categoryPrototype => {
      const parent = categoryPrototype.parent || 'root';
      if (!dict[parent]) {
        dict[parent] = [];
      }
      dict[parent].push(categoryPrototype);
    });

    const result: ICategoryPrototype[] = [];
    const addNodes = (parent: string) => {
      if (dict[parent]) {
        dict[parent].forEach(categoryPrototype => {
          result.push(categoryPrototype);
          addNodes(categoryPrototype.id);
        });
      }
    };

    addNodes('root');

    return result;
  }
}

export const categoryPrototypeService = new CategoryPrototypeServiceImpl();
