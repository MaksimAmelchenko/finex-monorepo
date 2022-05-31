import { action, makeObservable, observable } from 'mobx';

import { IContractor } from '../../types/contractor';
import { IDeletable, ISelectable } from '../../types';
import { IUser } from '../../types/user';

export class Contractor implements IContractor, ISelectable, IDeletable {
  readonly id: string;
  readonly user: IUser;
  name: string;
  note: string;

  isDeleting: boolean;
  isSelected: boolean;

  constructor({ id, user, name, note }: IContractor) {
    this.id = id;
    this.user = user;
    this.name = name;
    this.note = note;

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
