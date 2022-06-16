import { action, makeObservable, observable } from 'mobx';

import { IApiUser } from '../types/user';
import { MainStore } from '../core/main-store';
import { ManageableStore } from '../core/manageable-store';
import { User } from './models/user';

export interface IUsersApi {}

export class UsersRepository extends ManageableStore {
  static storeName = 'UsersRepository';

  users: User[] = [];

  constructor(mainStore: MainStore, private api: IUsersApi) {
    super(mainStore);
    makeObservable(this, {
      users: observable.shallow,
      consume: action,
      clear: action,
    });
  }

  consume(users: IApiUser[]): void {
    this.users = users.map(user => new User(user));
  }

  get(userId: string): User | undefined {
    return this.users.find(({ id }) => id === userId);
  }

  clear(): void {
    this.users = [];
  }
}
