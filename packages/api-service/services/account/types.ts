import { Permit } from '../../types/app';

export interface IAccount {
  id: string;
  name: string;
  accountTypeId: string;
  isEnabled: boolean;
  note: string | null;
  readers: string[];
  writers: string[];
  permit: Permit;
  userId: string;
}

export type IPublicAccount = IAccount;

export interface GetAccountsGatewayResponse {
  accounts: IAccount[];
}

export type GetAccountsServiceResponse = GetAccountsGatewayResponse;

export interface CreateAccountGatewayData {
  name: string;
  accountTypeId: string;
  isEnabled: boolean;
  note?: string;
  readers?: string[];
  writers?: string[];
}

export type CreateAccountServiceData = CreateAccountGatewayData;

export type CreateAccountGatewayResponse = IAccount;
export type CreateAccountServiceResponse = CreateAccountGatewayResponse;

export type UpdateAccountGatewayChanges = Partial<{
  name: string;
  accountTypeId: string;
  isEnabled: boolean;
  note: string;
  readers: string[];
  writers: string[];
}>;

export type UpdateAccountServiceChanges = UpdateAccountGatewayChanges;

export type UpdateAccountGatewayResponse = IAccount;
export type UpdateAccountServiceResponse = UpdateAccountGatewayResponse;
