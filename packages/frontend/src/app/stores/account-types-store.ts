import { AccountType } from './models/account-type';
import { ManageableStore } from '../core/manageable-store';
import { IApiAccountType } from '../types/account-type';

export class AccountTypesStore extends ManageableStore {
  static storeName = 'AccountTypesStore';

  accountTypes: AccountType[] = [];

  consume(accountTypes: IApiAccountType[]): void {
    this.accountTypes = accountTypes.map(
      ({ id, name, shortName }) =>
        new AccountType({
          id,
          name,
          shortName,
        })
    );
  }

  get(accountTypeId: string): AccountType | undefined {
    return this.accountTypes.find(({ id }) => id === accountTypeId);
  }

  clear(): void {
    this.accountTypes = [];
  }
}
