import { IModel } from './app';

export interface IResetPasswordRequest extends IModel {
  id: string;
  token: string;
  email: string;
  resetAt: string | null;
}

export interface IDBResetPasswordRequest {
  id: string;
  email: string;
  token: string;
  ip: string;
  created_at: string;
  updated_at: string;
  reset_at: string | null;
}

export interface ICreateParams {
  email: string;
  ip: string;
}

export interface IUpdateParams {
  reset_at: string;
}
