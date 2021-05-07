import { IUser } from './user';

export interface IUnitRaw {
  idUnit: number;
  idUser: number;
  name: string;
}

export interface IUnit {
  id: string;
  user: IUser;
  name: string;
}
