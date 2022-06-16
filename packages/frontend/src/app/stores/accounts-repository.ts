import { action, computed, makeObservable, observable } from 'mobx';

import { Account } from './models/account';
import { AccountTypesStore } from './account-types-store';
import { IUser } from '../types/user';
import { MainStore } from '../core/main-store';
import { ManageableStore } from '../core/manageable-store';
import { UsersRepository } from './users-repository';
import {
  CreateAccountData,
  CreateAccountResponse,
  GetAccountsResponse,
  IAccount,
  IApiAccount,
  UpdateAccountChanges,
  UpdateAccountResponse,
} from '../types/account';

export interface IAccountsApi {
  getAccounts: () => Promise<GetAccountsResponse>;
  createAccount: (data: CreateAccountData) => Promise<CreateAccountResponse>;
  updateAccount: (accountId: string, changes: UpdateAccountChanges) => Promise<UpdateAccountResponse>;
  deleteAccount: (accountId: string) => Promise<void>;
}

export class AccountsRepository extends ManageableStore {
  static storeName = 'AccountsRepository';

  private _accounts: Account[] = [];

  constructor(mainStore: MainStore, private api: IAccountsApi) {
    super(mainStore);

    makeObservable<AccountsRepository, '_accounts'>(this, {
      _accounts: observable.shallow,
      accounts: computed,
      consume: action,
      clear: action,
      deleteAccount: action,
    });
  }

  get accounts(): Account[] {
    return this._accounts.slice().sort(AccountsRepository.sort);
  }

  private static sort(a: Account, b: Account): number {
    if (a.isEnabled > b.isEnabled) {
      return -1;
    }
    if (a.isEnabled < b.isEnabled) {
      return 1;
    }

    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  }

  get(accountId: string): Account | undefined {
    return this._accounts.find(({ id }) => id === accountId);
  }

  consume(accounts: IApiAccount[]): void {
    this._accounts = accounts.map(account => this.decode(account));
  }

  getAccounts(): Promise<void> {
    return this.api.getAccounts().then(({ accounts }) => {
      this.consume(accounts);
    });
  }

  createAccount(account: Partial<IAccount> | Account, data: CreateAccountData): Promise<void> {
    return this.api.createAccount(data).then(
      action(response => {
        const account = this.decode(response.account);
        this._accounts.push(account);
      })
    );
  }

  updateAccount(account: Account, changes: UpdateAccountChanges): Promise<void> {
    return this.api.updateAccount(account.id, changes).then(
      action(response => {
        const updatedAccount = this.decode(response.account);
        const indexOf = this._accounts.indexOf(account);
        if (indexOf !== -1) {
          this._accounts[indexOf] = updatedAccount;
        } else {
          this._accounts.push(updatedAccount);
        }
      })
    );
  }

  deleteAccount(account: Account): Promise<void> {
    account.isDeleting = true;
    return this.api
      .deleteAccount(account.id)
      .then(
        action(() => {
          const indexOf = this._accounts.indexOf(account);
          if (indexOf !== -1) {
            this._accounts.splice(indexOf, 1);
          }
          // this._accounts = this._accounts.filter(a => a !== account);
        })
      )
      .finally(
        action(() => {
          account.isDeleting = false;
        })
      );
  }

  private decode(account: IApiAccount): Account {
    const { id, name, isEnabled, accountTypeId, note = '', permit, userId } = account;
    const accountTypesStore = this.getStore(AccountTypesStore);
    const usersRepository = this.getStore(UsersRepository);

    const accountType = accountTypesStore.get(accountTypeId);
    if (!accountType) {
      throw new Error('Account type is not found');
    }

    const user = usersRepository.get(userId);
    if (!user) {
      throw new Error('User is not found');
    }

    const viewers = account.viewers.reduce<IUser[]>((acc, userId) => {
      const user = usersRepository.get(userId);
      if (!user) {
        console.warn('Reader is not found', { account });
        return acc;
      }
      acc.push(user);

      return acc;
    }, []);

    const editors = account.editors.reduce<IUser[]>((acc, userId) => {
      const user = usersRepository.get(userId);
      if (!user) {
        console.warn('Writer is not found', { account });
        return acc;
      }
      acc.push(user);

      return acc;
    }, []);

    return new Account({
      id,
      name,
      isEnabled,
      accountType,
      note,
      viewers,
      editors,
      permit,
      user,
    });
  }

  clear(): void {
    this._accounts = [];
  }
}
