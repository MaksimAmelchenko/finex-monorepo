import { Permit } from '../../types/app';

export interface IAccount {
  idAccount: number;
  idAccountType: number;
  name: string;
  isEnabled: boolean;
  note: string | null;
  viewers: number[];
  editors: number[];
  permit: Permit;
  idUser: number;
}

export interface IPublicAccount {
  id: string;
  accountTypeId: string;
  name: string;
  isEnabled: boolean;
  note: string | null;
  viewers: string[];
  editors: string[];
  permit: Permit;
  userId: string;
}

export interface CreateAccountGatewayData {
  name: string;
  accountTypeId: string;
  isEnabled?: boolean;
  note?: string;
}

export type CreateAccountServiceData = CreateAccountGatewayData & {
  viewers?: string[];
  editors?: string[];
};

export type CreateAccountAPIData = Partial<CreateAccountServiceData> &
  Pick<CreateAccountServiceData, 'name' | 'accountTypeId'>;

export type UpdateAccountGatewayChanges = Partial<{
  name: string;
  accountTypeId: string;
  isEnabled: boolean;
  note: string;
}>;

export type UpdateAccountServiceChanges = UpdateAccountGatewayChanges &
  Partial<{
    viewers: string[];
    editors: string[];
  }>;

export interface AccountPermit {
  accountId: string;
  permit: Permit;
}
