export interface ITag {
  idProject: number;
  idTag: number;
  idUser: number;
  name: string;
}

export type IPublicTag = {
  id: string;
  userId: string;
  name: string;
};

export type CreateTagGatewayData = {
  name: string;
};

export type CreateTagServiceData = CreateTagGatewayData;

export type UpdateTagGatewayChanges = Partial<{
  name: string;
}>;

export type UpdateTagServiceChanges = UpdateTagGatewayChanges;
