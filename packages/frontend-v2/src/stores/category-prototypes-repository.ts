import { ManageableStore } from '../core/manageable-store';
import { ICategoryPrototype, ICategoryPrototypeRaw } from '../types/category';
import { CategoryPrototype } from './models/category-prototype';

export class CategoryPrototypesRepository extends ManageableStore {
  static storeName = 'CategoryPrototypesRepository';

  categoryPrototypes: ICategoryPrototype[] = [];

  consume(categoryPrototypes: ICategoryPrototypeRaw[]): void {
    this.categoryPrototypes = categoryPrototypes.reduce((acc, categoryPrototypeRaw) => {
      const { idCategoryPrototype, name, parent } = categoryPrototypeRaw;
      let parentCategoryPrototype: ICategoryPrototype | null = null;

      if (parent) {
        parentCategoryPrototype = acc.find(categoryPrototype => categoryPrototype.id === String(parent)) || null;
        if (!parentCategoryPrototype) {
          console.warn('Parent category prototype is not found', {});
          return acc;
        }
      }
      acc.push(new CategoryPrototype({ id: String(idCategoryPrototype), name, parent: parentCategoryPrototype }));

      return acc;
    }, [] as ICategoryPrototype[]);
  }

  get(categoryPrototypeId: string): ICategoryPrototype | undefined {
    return this.categoryPrototypes.find(({ id }) => id === categoryPrototypeId);
  }

  clear(): void {
    this.categoryPrototypes = [];
  }
}
