import { Category } from './model/category';

export interface ICategory {
  idProject: number;
  idCategory: number;
  name: string;
  parent: number | null;
  idCategoryPrototype: number | null;
  isEnabled: boolean;
  note: string | null;
  isSystem: boolean;
  idUser: number;
}

export interface IPublicCategory {
  id: string;
  name: string;
  parent: string | null;
  categoryPrototypeId: string | null;
  isEnabled: boolean;
  note: string;
  isSystem: boolean;
  userId: string;
}

export interface GetCategoriesGatewayResponse {
  categories: ICategory[];
}

export type GetCategoriesServiceResponse = GetCategoriesGatewayResponse;

export interface CreateCategoryGatewayData {
  name: string;
  parent?: string | null;
  categoryPrototypeId?: string | null;
  isEnabled: boolean;
  note?: string;
}

export type CreateCategoryServiceData = CreateCategoryGatewayData;

export type CreateCategoryGatewayResponse = Category;
export type CreateCategoryServiceResponse = CreateCategoryGatewayResponse;

export type UpdateCategoryGatewayChanges = Partial<{
  name: string;
  parent: string | null;
  categoryPrototypeId: string | null;
  isEnabled: boolean;
  note: string;
}>;

export type UpdateCategoryServiceChanges = UpdateCategoryGatewayChanges;

export type UpdateCategoryGatewayResponse = Category;
export type UpdateCategoryServiceResponse = UpdateCategoryGatewayResponse;

export type MoveCategoryGatewayParams = {
  categoryId: string;
  categoryIdTo: string;
  isRecursive: boolean;
};
export type MoveCategoryServiceParams = MoveCategoryGatewayParams;

export type MoveCategoryGatewayResponse = { count: number };
export type MoveCategoryServiceResponse = MoveCategoryGatewayResponse;
