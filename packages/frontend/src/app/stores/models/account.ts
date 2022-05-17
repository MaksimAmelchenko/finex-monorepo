import { action, makeObservable, observable } from 'mobx';

import { IAccount } from '../../types/account';
import { IAccountType } from '../../types/account-type';
import { IDeletable, ISelectable, Permit } from '../../types';
import { IUser } from '../../types/user';

export class Account implements IAccount, ISelectable, IDeletable {
  readonly id: string;
  accountType: IAccountType;
  readonly user: IUser;
  isEnabled: boolean;
  name: string;
  note: string;
  readonly permit: Permit;
  readers: IUser[];
  writers: IUser[];

  isDeleting: boolean;
  isSelected: boolean;

  constructor({ id, accountType, isEnabled, user, name, note, permit, readers, writers }: IAccount) {
    this.id = id;
    this.accountType = accountType;
    this.user = user;
    this.isEnabled = isEnabled;
    this.name = name;
    this.note = note;
    this.permit = permit;
    this.readers = readers;
    this.writers = writers;

    this.isDeleting = false;
    this.isSelected = false;

    makeObservable(this, {
      isDeleting: observable,
      isSelected: observable,
      toggleSelection: action,
    });
  }

  toggleSelection() {
    this.isSelected = !this.isSelected;
  }
}
