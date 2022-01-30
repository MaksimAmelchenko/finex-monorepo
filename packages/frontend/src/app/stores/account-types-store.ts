import { AccountType } from './models/account-type';
import { ManageableStore } from '../core/manageable-store';
import { IAccountType, IAccountTypeRaw } from '../types/account-type';

export class AccountTypesStore extends ManageableStore {
  static storeName = 'AccountTypesStore';

  accountTypes: IAccountType[] = [];

  consume(accountTypes: IAccountTypeRaw[]): void {
    this.accountTypes = accountTypes.map(
      ({ idAccountType, name, shortName }) =>
        new AccountType({
          id: String(idAccountType),
          name,
          shortName,
        })
    );
  }

  get(accountTypeId: string): IAccountType | undefined {
    return this.accountTypes.find(({ id }) => id === accountTypeId);
  }

  clear(): void {
    this.accountTypes = [];
  }
}
