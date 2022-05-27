import { IUnit } from './unit';
import { IUser } from './user';
import { CategoryPrototype } from '../stores/models/category-prototype';

export interface IAPICategoryPrototype {
  id: string;
  name: string;
  parent: string | null;
}

export interface ICategoryPrototype {
  id: string;
  name: string;
  parent: CategoryPrototype | null;
}

export interface IAPICategory {
  id: string;
  name: string;
  parent: string | null;
  categoryPrototypeId: string | null;
  isEnabled: boolean;
  note: string;

  isSystem: boolean;
  unitId: string | null;
  userId: string;
}

export interface ICategory {
  id: string;
  name: string;
  parent: ICategory | null;
  categoryPrototype: ICategoryPrototype | null;
  isEnabled: boolean;
  note: string;

  isSystem: boolean;
  unit: IUnit | null;
  user: IUser;
}

export interface GetCategoriesResponse {
  categories: IAPICategory[];
}

export interface CreateCategoryData {
  name: string;
  parent?: string | null;
  categoryPrototypeId?: string | null;
  isEnabled?: boolean;
  note?: string;
}

export interface CreateCategoryResponse {
  category: IAPICategory;
}

export type UpdateCategoryChanges = Partial<{
  name: string;
  parent: string | null;
  categoryPrototypeId: string | null;
  isEnabled: boolean;
  note: string;
}>;

export interface UpdateCategoryResponse {
  category: IAPICategory;
}

export interface MoveTransactionsData {
  categoryIdFrom: string;
  categoryIdTo: string;
  isRecursive: boolean;
}
