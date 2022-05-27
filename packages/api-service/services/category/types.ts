export interface ICategory {
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

export type IPublicCategory = ICategory;

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

export type CreateCategoryGatewayResponse = ICategory;
export type CreateCategoryServiceResponse = CreateCategoryGatewayResponse;

export type UpdateCategoryGatewayChanges = Partial<{
  name: string;
  parent: string | null;
  categoryPrototypeId: string | null;
  isEnabled: boolean;
  note: string;
}>;

export type UpdateCategoryServiceChanges = UpdateCategoryGatewayChanges;

export type UpdateCategoryGatewayResponse = ICategory;
export type UpdateCategoryServiceResponse = UpdateCategoryGatewayResponse;

export type MoveCategoryGatewayParams = {
  categoryId: string;
  categoryIdTo: string;
  isRecursive: boolean;
};
export type MoveCategoryServiceParams = MoveCategoryGatewayParams;

export type MoveCategoryGatewayResponse = { count: number };
export type MoveCategoryServiceResponse = MoveCategoryGatewayResponse;
