import { IModel } from './app';

export interface ISignUpRequest extends IModel {
  id: string;
  token: string;
  name: string;
  email: string;
  password: string;
  confirmedAt: string | null;
}

export interface IDBSignUpRequest {
  id: string;
  token: string;
  name: string;
  email: string;
  password: string;
  confirmed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ISignUpRequestResponse {
  id: string;
}

export interface ICreateSingUpRequestServiceParams {
  name: string;
  email: string;
  password: string;
  origin: string;
}

export interface ICreateSingUpRequestRepositoryParams extends Omit<ICreateSingUpRequestServiceParams, 'origin'> {}

export interface IUpdateParams {
  confirmed_at: string;
}
