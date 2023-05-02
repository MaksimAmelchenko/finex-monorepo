import { Category } from '../stores/models/category';
import { CategoryPrototype } from '../stores/models/category-prototype';
import { User } from '../stores/models/user';

export interface ICategoryPrototypeDTO {
  id: string;
  name: string;
  parent: string | null;
  isEnabled: boolean;
  isSystem: boolean;
}

export interface ICategoryPrototype extends Omit<ICategoryPrototypeDTO, 'parent'> {
  parent: CategoryPrototype | null;
}

export interface ICategoryDTO {
  id: string;
  name: string;
  parent: string | null;
  categoryPrototypeId: string | null;
  isEnabled: boolean;
  note: string;

  isSystem: boolean;
  userId: string;
}

export interface ICategory extends Omit<ICategoryDTO, 'parent' | 'categoryPrototypeId' | 'userId'> {
  parent: Category | null;
  categoryPrototype: CategoryPrototype | null;
  user: User;
}

export interface GetCategoriesResponse {
  categories: ICategoryDTO[];
}

export interface CreateCategoryData {
  name: string;
  parent?: string | null;
  categoryPrototypeId?: string | null;
  isEnabled?: boolean;
  note?: string;
}

export interface CreateCategoryResponse {
  category: ICategoryDTO;
}

export type UpdateCategoryChanges = Partial<{
  name: string;
  parent: string | null;
  categoryPrototypeId: string | null;
  isEnabled: boolean;
  note: string;
}>;

export interface UpdateCategoryResponse {
  category: ICategoryDTO;
}
