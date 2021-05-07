import { IAccountType } from './account-type';
import { IUser } from './user';
import { Permit } from './index';

export interface IAccountRaw {
  idAccount: number;
  idAccountType: number;
  idUser: number;
  isEnabled: boolean;
  name: string;
  note: string;
  permit: Permit;
  readers: number[];
  writers: number[];
}

export interface IAccount {
  id: string;
  accountType: IAccountType;
  user: IUser;
  isEnabled: boolean;
  name: string;
  note: string;
  permit: Permit;
  readers: IUser[];
  writers: IUser[];
}
