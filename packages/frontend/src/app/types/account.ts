import { IAccountType } from './account-type';
import { IUser } from './user';
import { Permit } from './index';

export interface IAPIAccount {
  id: string;
  name: string;
  accountTypeId: string;
  isEnabled: boolean;
  note: string;
  readers: string[];
  writers: string[];
  permit: Permit;
  userId: string;
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

export interface GetAccountsResponse {
  accounts: IAPIAccount[];
}

export interface CreateAccountData {
  name: string;
  accountTypeId: string;
  isEnabled: boolean;
  note?: string;
  readers?: string[];
  writers?: string[];
}

export interface CreateAccountResponse {
  account: IAPIAccount;
}

export type UpdateAccountChanges = Partial<{
  name: string;
  accountTypeId: string;
  isEnabled: boolean;
  note: string;
  readers: string[];
  writers: string[];
}>;

export interface UpdateAccountResponse {
  account: IAPIAccount;
}
