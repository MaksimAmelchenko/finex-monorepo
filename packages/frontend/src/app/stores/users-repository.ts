import { action, makeObservable, observable } from 'mobx';

import { ManageableStore } from '../core/manageable-store';
import { MainStore } from '../core/main-store';
import { User } from './models/user';
import { IUser, IUserRaw } from '../types/user';

export interface IUsersApi {}

export class UsersRepository extends ManageableStore {
  static storeName = 'UsersRepository';

  users: IUser[] = [];

  constructor(mainStore: MainStore, private api: IUsersApi) {
    super(mainStore);
    makeObservable(this, {
      users: observable.shallow,
      consume: action,
      clear: action,
    });
  }

  consume(users: IUserRaw[]): void {
    this.users = users.map(
      ({ idUser, name, email }) =>
        new User({
          id: String(idUser),
          name,
          email,
        })
    );
  }

  get(userId: string): IUser | undefined {
    return this.users.find(({ id }) => id === userId);
  }

  clear(): void {
    this.users = [];
  }
}
