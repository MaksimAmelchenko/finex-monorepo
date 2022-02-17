import { IModel, Permit } from './app';

export interface IDBProject {
  idProject: number;
  name: string;
  note: string;
  idUser: number;
  // created_at: string;
  // updated_at: string;
  permit: Permit;
}

export interface IProject extends IModel {
  id: number;
  name: string;
  note: string;
  userId: number;
}

export interface IPublicProject extends IModel {
  id: number;
  name: string;
  note: string;
  userId: number;
}

export interface ICreateParams {
  id_user: number;
  name: string;
  note?: string;
}

export interface IUpdateParams {
  name?: string;
  note?: string;
}
