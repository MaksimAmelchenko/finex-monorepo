import { Category } from '../stores/models/category';
import { CategoryPrototype } from '../stores/models/category-prototype';
import { User } from '../stores/models/user';

export interface IApiCategoryPrototype {
  id: string;
  name: string;
  parent: string | null;
}

export interface ICategoryPrototype {
  id: string;
  name: string;
  parent: CategoryPrototype | null;
}

export interface IApiCategory {
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
  parent: Category | null;
  categoryPrototype: CategoryPrototype | null;
  isEnabled: boolean;
  note: string;
  isSystem: boolean;
  user: User;
}

export interface GetCategoriesResponse {
  categories: IApiCategory[];
}

export interface CreateCategoryData {
  name: string;
  parent?: string | null;
  categoryPrototypeId?: string | null;
  isEnabled?: boolean;
  note?: string;
}

export interface CreateCategoryResponse {
  category: IApiCategory;
}

export type UpdateCategoryChanges = Partial<{
  name: string;
  parent: string | null;
  categoryPrototypeId: string | null;
  isEnabled: boolean;
  note: string;
}>;

export interface UpdateCategoryResponse {
  category: IApiCategory;
}
