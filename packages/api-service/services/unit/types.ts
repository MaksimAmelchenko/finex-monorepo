export interface IUnit {
  idProject: number;
  idUnit: number;
  idUser: number;
  name: string;
}

export type IPublicUnit = {
  id: string;
  userId: string;
  name: string;
};

export type CreateUnitGatewayData = {
  name: string;
};

export type CreateUnitServiceData = CreateUnitGatewayData;

export type UpdateUnitGatewayChanges = Partial<{
  name: string;
}>;

export type UpdateUnitServiceChanges = UpdateUnitGatewayChanges;
