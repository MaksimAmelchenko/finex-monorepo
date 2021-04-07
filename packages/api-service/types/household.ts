import { IModel, TDateTime } from './app';

export interface IDBHousehold {
  id_household: number;
  created_at: TDateTime;
  updated_at: TDateTime;
}

export interface IHousehold extends IModel {
  id: number;
}
