import { action, computed, makeObservable, observable } from 'mobx';

import { Category } from './models/category';
import { CategoryPrototypesRepository } from './category-prototypes-repository';
import {
  CreateCategoryData,
  CreateCategoryResponse,
  GetCategoriesResponse,
  IAPICategory,
  ICategory,
  ICategoryPrototype,
  UpdateCategoryChanges,
  UpdateCategoryResponse,
} from '../types/category';
import { IUnit } from '../types/unit';
import { MainStore } from '../core/main-store';
import { ManageableStore } from '../core/manageable-store';
import { UnitsRepository } from './units-repository';
import { UsersRepository } from './users-repository';

export interface ICategoriesApi {
  getCategories: () => Promise<GetCategoriesResponse>;
  createCategory: (data: CreateCategoryData) => Promise<CreateCategoryResponse>;
  updateCategory: (categoryId: string, changes: UpdateCategoryChanges) => Promise<UpdateCategoryResponse>;
  deleteCategory: (categoryId: string) => Promise<void>;
  moveTransactions: (categoryIdFrom: string, categoryIdTo: string, isRecursive: boolean) => Promise<{ count: number }>;
}

export class CategoriesRepository extends ManageableStore {
  static storeName = 'CategoriesRepository';

  private _categories: Category[] = [];
  private categoryMap: Map<string, Category> = new Map();

  constructor(mainStore: MainStore, private api: ICategoriesApi) {
    super(mainStore);
    makeObservable<CategoriesRepository, '_categories'>(this, {
      _categories: observable,
      categories: computed,
      consume: action,
      clear: action,
      deleteCategory: action,
    });
  }

  get categories(): Category[] {
    return this._categories
      .slice()
      .sort((a, b) => a.fullPath(true).localeCompare(b.fullPath(true), 'en', { sensitivity: 'base' }));
  }

  get(categoryId: string): Category | undefined {
    return this.categoryMap.get(categoryId);
  }

  consume(categories: IAPICategory[]): void {
    this._categories = categories.map(category => this.decode(category));

    categories.forEach(({ id, parent }) => {
      if (parent) {
        const category = this.categoryMap.get(id);
        if (category) {
          const parentCategory = this.get(parent) ?? null;
          if (parentCategory) {
            category.parent = parentCategory;
          } else {
            console.warn('Parent category is not found', { category });
          }
        }
      }
    });
  }

  getCategories(): Promise<void> {
    return this.api.getCategories().then(({ categories }) => {
      this.consume(categories);
    });
  }

  createCategory(category: Partial<ICategory> | Category, data: CreateCategoryData): Promise<void> {
    return this.api.createCategory(data).then(
      action(response => {
        const category = this.decode(response.category);
        this._categories.push(category);
      }),
    );
  }

  updateCategory(category: Category, changes: UpdateCategoryChanges): Promise<void> {
    return this.api.updateCategory(category.id, changes).then(
      action(response => {
        const updatedCategory = this.decode(response.category);
        const indexOf = this._categories.indexOf(category);
        if (indexOf !== -1) {
          const { name, categoryPrototype, parent, isEnabled, note } = updatedCategory;
          const category = this._categories[indexOf];
          category.name = name;
          category.categoryPrototype = categoryPrototype;
          category.parent = parent;
          category.isEnabled = isEnabled;
          category.note = note;
        } else {
          this._categories.push(updatedCategory);
        }
      }),
    );
  }

  deleteCategory(category: Category): Promise<void> {
    category.isDeleting = true;
    return this.api.deleteCategory(category.id).then(
      action(() => {
        const indexOf = this._categories.indexOf(category);
        if (indexOf !== -1) {
          this._categories.splice(indexOf, 1);
        }
      }),
    );
  }

  moveTransactions(categoryIdFrom: string, categoryIdTo: string, isRecursive: boolean): Promise<{ count: number }> {
    return this.api.moveTransactions(categoryIdFrom, categoryIdTo, isRecursive);
  }

  private decode({
    id,
    name,
    parent,
    categoryPrototypeId,
    isEnabled,
    note,
    unitId,
    userId,
    isSystem,
  }: IAPICategory): Category {
    const categoryPrototypesRepository = this.getStore(CategoryPrototypesRepository);
    const unitsRepository = this.getStore(UnitsRepository);
    const usersRepository = this.getStore(UsersRepository);

    const user = usersRepository.get(userId);
    if (!user) {
      throw new Error('User is not found');
    }

    let parentCategory: ICategory | null = null;
    if (parent) {
      // the order of the categories is not guaranteed
      // it is possible that the parent is not set
      // need to set the parent later
      parentCategory = this.get(parent) ?? null;
    }

    let categoryPrototype: ICategoryPrototype | null = null;
    if (categoryPrototypeId) {
      categoryPrototype = categoryPrototypesRepository.get(categoryPrototypeId) ?? null;
      if (!categoryPrototype) {
        throw new Error('Category prototype is not found');
      }
    }

    let unit: IUnit | null = null;
    if (unitId) {
      unit = unitsRepository.get(unitId) ?? null;
      if (!unit) {
        throw new Error('Unit is not found');
      }
    }

    const category = new Category({
      id,
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
    return category;
  }

  clear(): void {
    this._categories = [];
  }
}
