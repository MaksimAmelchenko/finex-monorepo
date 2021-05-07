import { action, makeObservable, observable } from 'mobx';

import { ManageableStore } from '../core/manageable-store';
import { MainStore } from '../core/main-store';
import { AccountTypesStore } from './account-types-store';
import { Account } from './models/account';
import { UsersRepository } from './users-repository';
import { IAccount, IAccountRaw } from '../types/account';
import { IUser } from '../types/user';

export interface IAccountsApi {}

export class AccountsRepository extends ManageableStore {
  static storeName = 'AccountsRepository';

  accounts: IAccount[] = [];

  constructor(mainStore: MainStore, private api: IAccountsApi) {
    super(mainStore);
    makeObservable(this, {
      accounts: observable.shallow,
      consume: action,
      clear: action,
    });
  }

  consume(accounts: IAccountRaw[]): void {
    const accountTypesStore = this.getStore(AccountTypesStore);
    const usersRepository = this.getStore(UsersRepository);
    this.accounts = accounts.reduce((acc, accountRaw) => {
      const { idAccount, idAccountType, idUser, isEnabled, name, note, permit } = accountRaw;
      const accountType = accountTypesStore.get(String(idAccountType));
      if (!accountType) {
        console.warn('AccountType is not found', { accountRaw });
        return acc;
      }

      const user = usersRepository.get(String(idUser));
      if (!user) {
        console.warn('User is not found', { accountRaw });
        return acc;
      }

      const readers: IUser[] = accountRaw.readers.reduce((acc, idUser) => {
        const user = usersRepository.get(String(idUser));
        if (!user) {
          console.warn('Reader is not found', { accountRaw });
          return acc;
        }
        acc.push(user);

        return acc;
      }, [] as IUser[]);

      const writers: IUser[] = accountRaw.writers.reduce((acc, idUser) => {
        const user = usersRepository.get(String(idUser));
        if (!user) {
          console.warn('Writer is not found', { accountRaw });
          return acc;
        }
        acc.push(user);

        return acc;
      }, [] as IUser[]);

      const account = new Account({
        id: String(idAccount),
        accountType,
        user,
        isEnabled,
        name,
        note,
        permit,
        readers,
        writers,
      });

      acc.push(account);
      return acc;
    }, [] as Account[]);
  }

  get(accountId: string): IAccount | undefined {
    return this.accounts.find(({ id }) => id === accountId);
  }

  clear(): void {
    this.accounts = [];
  }
}
