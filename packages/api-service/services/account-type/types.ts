export interface IAccountType {
  idAccountType: number;
  name: string;
  shortName: string;
}

export type IPublicAccountType = {
  id: string;
  name: string;
  shortName: string;
};

export interface GetAccountTypesGatewayResponse {
  accountTypes: IAccountType[];
}

export type GetAccountTypesServiceResponse = GetAccountTypesGatewayResponse;
