import { IModel } from './app';

export interface IProfile extends IModel {
  userId: string;
  name: string;
  email: string;
  projectId: string;
  currencyRateSourceId: string;
}

export interface IPublicProfile extends IModel {
  idUser: string;
  name: string;
  email: string;
  idProject: string;
  idCurrencyRateSource: string;
}

// export interface IUpdateParams {
//   username?: string;
//   fullName?: string;
//   color?: string;
//   timeout?: string;
//   plainPassword?: string;
// }
//
// export interface IGatewayUpdateParams {
//   username?: string;
//   fullName?: string;
//   color?: string;
//   timeout?: string;
//   password?: string;
// }
