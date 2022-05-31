import { action, makeObservable, observable } from 'mobx';

import { IUnit } from '../../types/unit';
import { IDeletable, ISelectable } from '../../types';
import { IUser } from '../../types/user';

export class Unit implements IUnit, ISelectable, IDeletable {
  readonly id: string;
  readonly user: IUser;
  name: string;

  isDeleting: boolean;
  isSelected: boolean;

  constructor({ id, user, name }: IUnit) {
    this.id = id;
    this.user = user;
    this.name = name;

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
