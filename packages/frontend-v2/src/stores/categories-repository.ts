import { action, makeObservable, observable } from 'mobx';

import { ManageableStore } from '../core/manageable-store';
import { MainStore } from '../core/main-store';
import { ICategory, ICategoryPrototype, ICategoryRaw } from '../types/category';
import { UsersRepository } from './users-repository';
import { CategoryPrototypesRepository } from './category-prototypes-repository';
import { UnitsRepository } from './units-repository';
import { IUnit } from '../types/unit';
import { Category } from './models/category';

export interface ICategoriesApi {}

export class CategoriesRepository extends ManageableStore {
  static storeName = 'CategoriesRepository';

  categories: ICategory[] = [];
  private categoryMap: Map<string, ICategory> = new Map();

  constructor(mainStore: MainStore, private api: ICategoriesApi) {
    super(mainStore);
    makeObservable(this, {
      categories: observable.shallow,
      consume: action,
      clear: action,
    });
  }

  consume(categories: ICategoryRaw[]): void {
    const categoryPrototypesRepository = this.getStore(CategoryPrototypesRepository);
    const usersRepository = this.getStore(UsersRepository);
    const unitsRepository = this.getStore(UnitsRepository);

    this.categories = categories.reduce((acc, categoryRaw) => {
      const { idCategory, idCategoryPrototype, name, note, idUnit, idUser, isEnabled, isSystem } = categoryRaw;

      const user = usersRepository.get(String(idUser));
      if (!user) {
        console.warn('User is not found', { categoryRaw });
        return acc;
      }

      // the order of the categories is not guaranteed
      // set the parent on the second step
      const parentCategory: ICategory | null = null;

      let categoryPrototype: ICategoryPrototype | null = null;
      if (idCategoryPrototype) {
        categoryPrototype = categoryPrototypesRepository.get(String(idCategoryPrototype)) || null;
        if (!categoryPrototype) {
          console.warn('CategoryPrototype is not found', { categoryRaw });
          return acc;
        }
      }

      let unit: IUnit | null = null;
      if (idUnit) {
        unit = unitsRepository.get(String(idUnit)) || null;
        if (!unit) {
          console.warn('Unit is not found', { categoryRaw });
          return acc;
        }
      }

      const category = new Category({
        id: String(idCategory),
        parent: parentCategory,
        categoryPrototype,
        user,
        unit,
        name,
        isEnabled,
        isSystem,
        note,
      });
      this.categoryMap.set(category.id, category);

      acc.push(category);

      return acc;
    }, [] as ICategory[]);

    // set the parent categories
    categories.forEach(categoryRaw => {
      const { idCategory, parent } = categoryRaw;
      if (parent) {
        const category = this.categoryMap.get(String(idCategory));
        if (category) {
          const parentCategory = this.categoryMap.get(String(parent)) || null;
          if (parentCategory) {
            category.parent = parentCategory;
          } else {
            console.warn('Parent category is not found', { categoryRaw });
          }
        }
      }
    });
  }

  get(categoryId: string): ICategory | undefined {
    return this.categoryMap.get(categoryId);
  }

  clear(): void {
    this.categories = [];
  }
}
