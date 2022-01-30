import { ApiRepository } from '../../core/other-stores/api-repository';
import { IAccountsApi } from '../accounts-repository';

export class AccountsApi extends ApiRepository implements IAccountsApi {
  static override storeName = 'AccountsApi';
}
