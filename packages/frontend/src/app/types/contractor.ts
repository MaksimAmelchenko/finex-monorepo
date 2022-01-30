import { IUser } from './user';

export interface IContractorRaw {
  idContractor: number;
  idUser: number;
  name: string;
  note: string;
}

export interface IContractor {
  id: string;
  user: IUser;
  name: string;
  note: string;
}
