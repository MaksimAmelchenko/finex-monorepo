import { AccountType } from '../stores/models/account-type';
import { Permit } from './index';
import { User } from '../stores/models/user';

export interface IApiAccount {
  id: string;
  name: string;
  accountTypeId: string;
  isEnabled: boolean;
  note: string;
  viewers: string[];
  editors: string[];
  permit: Permit;
  userId: string;
}

export interface IAccount {
  id: string;
  accountType: AccountType;
  user: User;
  isEnabled: boolean;
  name: string;
  note: string;
  permit: Permit;
  viewers: User[];
  editors: User[];
}

export interface GetAccountsResponse {
  accounts: IApiAccount[];
}

export interface CreateAccountData {
  name: string;
  accountTypeId: string;
  isEnabled: boolean;
  note?: string;
  viewers?: string[];
  editors?: string[];
}

export interface CreateAccountResponse {
  account: IApiAccount;
}

export type UpdateAccountChanges = Partial<{
  name: string;
  accountTypeId: string;
  isEnabled: boolean;
  note: string;
  viewers: string[];
  editors: string[];
}>;

export interface UpdateAccountResponse {
  account: IApiAccount;
}
