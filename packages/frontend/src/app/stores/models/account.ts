import { action, makeObservable, observable } from 'mobx';

import { IAccount } from '../../types/account';
import { IAccountType } from '../../types/account-type';
import { IDeletable, ISelectable, Permit } from '../../types';
import { User } from './user';

export class Account implements IAccount, ISelectable, IDeletable {
  readonly id: string;
  accountType: IAccountType;
  readonly user: User;
  isEnabled: boolean;
  name: string;
  note: string;
  readonly permit: Permit;
  viewers: User[];
  editors: User[];

  isDeleting: boolean;
  isSelected: boolean;

  constructor({ id, accountType, isEnabled, user, name, note, permit, viewers, editors }: IAccount) {
    this.id = id;
    this.accountType = accountType;
    this.user = user;
    this.isEnabled = isEnabled;
    this.name = name;
    this.note = note;
    this.permit = permit;
    this.viewers = viewers;
    this.editors = editors;

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
