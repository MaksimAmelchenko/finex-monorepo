import { AccountType } from './models/account-type';
import { ManageableStore } from '../core/manageable-store';
import { IAccountTypeDTO } from '../types/account-type';

export class AccountTypesStore extends ManageableStore {
  static storeName = 'AccountTypesStore';

  accountTypes: AccountType[] = [];

  consume(accountTypes: IAccountTypeDTO[]): void {
    this.accountTypes = accountTypes.map(
      ({ id, name }) =>
        new AccountType({
          id,
          name,
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
