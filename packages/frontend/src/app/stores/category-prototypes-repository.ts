import { ManageableStore } from '../core/manageable-store';
import { IApiCategoryPrototype, ICategoryPrototype } from '../types/category';
import { CategoryPrototype } from './models/category-prototype';

export class CategoryPrototypesRepository extends ManageableStore {
  static storeName = 'CategoryPrototypesRepository';

  categoryPrototypes: CategoryPrototype[] = [];

  consume(categoryPrototypes: IApiCategoryPrototype[]): void {
    this.categoryPrototypes = categoryPrototypes.reduce<CategoryPrototype[]>((acc, { id, name, parent }) => {
      let parentCategoryPrototype: CategoryPrototype | null = null;

      if (parent) {
        parentCategoryPrototype = acc.find(categoryPrototype => categoryPrototype.id === parent) || null;
        if (!parentCategoryPrototype) {
          console.warn('Parent category prototype is not found', {});
          return acc;
        }
      }
      acc.push(new CategoryPrototype({ id, name, parent: parentCategoryPrototype }));

      return acc;
    }, []);
  }

  get(categoryPrototypeId: string): CategoryPrototype | undefined {
    return this.categoryPrototypes.find(({ id }) => id === categoryPrototypeId);
  }

  clear(): void {
    this.categoryPrototypes = [];
  }
}
