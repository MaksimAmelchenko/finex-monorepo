export interface IContractor {
  idProject: number;
  idContractor: number;
  idUser: number;
  name: string;
  note: string | null;
}

export type IPublicContractor = {
  id: string;
  userId: string;
  name: string;
  note: string;
};

export interface GetContractorGatewayResponse {
  contractor: IContractor[];
}

export type GetContractorServiceResponse = GetContractorGatewayResponse;

export type CreateContractorGatewayData = {
  name: string;
  note?: string;
};

export type CreateContractorServiceData = CreateContractorGatewayData;

export type UpdateContractorGatewayChanges = Partial<{
  name: string;
  note: string;
}>;

export type UpdateContractorServiceChanges = UpdateContractorGatewayChanges;
