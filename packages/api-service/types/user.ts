import { IModel } from './app';

export interface IUser extends IModel {
  id: number;
  name: string;
  email: string;
  password: string;
  tz?: string;
  timeout: string;
  householdId: number;
  projectId?: number;
  currencyRateSourceId: number;
}

export interface IDBUser {
  id_user: number;
  name: string;
  email: string;
  password: string;
  tz?: string;
  timeout: string;
  id_household: number;
  id_project?: number;
  id_currency_rate_source: number;
  id_user_status: number;
  created_at: string;
  updated_at: string;
}

export interface IPublicUser extends IModel {
  idUser: number;
  name: string;
  username: string;
  password: string;
  tz?: string;
  timeout: string;
  idHousehold: number;
  idProject?: number;
  idCurrencyRateSource: number;
}

export interface ICreateParams {
  name: string;
  email: string;
  password: string;
  id_household: number;
  id_currency_rate_source: number;
}

export interface IUpdateParams {
  name?: string;
  password?: string;
  tz?: string;
  timeout?: string;
  id_project?: number;
  id_currency_rate_source?: number;
}
