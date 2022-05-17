import { ApiRepository } from '../../core/other-stores/api-repository';
import { IAccountsApi } from '../accounts-repository';
import {
  CreateAccountData,
  CreateAccountResponse,
  GetAccountsResponse,
  UpdateAccountChanges,
  UpdateAccountResponse,
} from '../../types/account';

export class AccountsApi extends ApiRepository implements IAccountsApi {
  static override storeName = 'AccountsApi';

  getAccounts(): Promise<GetAccountsResponse> {
    return this.fetch<GetAccountsResponse>({
      method: 'GET',
      url: '/v2/accounts',
    });
  }

  createAccount(data: CreateAccountData): Promise<CreateAccountResponse> {
    return this.fetch<CreateAccountResponse>({
      method: 'POST',
      url: '/v2/accounts',
      body: data,
    });
  }

  updateAccount(accountId: string, changes: UpdateAccountChanges): Promise<UpdateAccountResponse> {
    return this.fetch<CreateAccountResponse>({
      method: 'PATCH',
      url: `/v2/accounts/${accountId}`,
      body: changes,
    });
  }

  deleteAccount(accountId: string): Promise<void> {
    return this.fetch<void>({
      method: 'DELETE',
      url: `/v2/accounts/${accountId}`,
    });
  }
}
