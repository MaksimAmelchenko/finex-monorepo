import { action, makeObservable, observable } from 'mobx';

import { ITag } from '../../types/tag';
import { IDeletable, ISelectable } from '../../types';
import { IUser } from '../../types/user';

export class Tag implements ITag, ISelectable, IDeletable {
  readonly id: string;
  readonly user: IUser;
  name: string;

  isDeleting: boolean;
  isSelected: boolean;

  constructor({ id, user, name }: ITag) {
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
