export interface ICategoryPrototype {
  idCategoryPrototype: number;
  name: string;
  parent: number | null;
  isEnabled: boolean;
  isSystem: boolean;
}

export type IPublicCategoryPrototype = {
  id: string;
  name: string;
  parent: string | null;
};

export interface GetCategoryPrototypesGatewayResponse {
  categoryPrototypes: ICategoryPrototype[];
}

export type GetCategoryPrototypesServiceResponse = GetCategoryPrototypesGatewayResponse;
