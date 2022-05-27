import { action, makeObservable, observable } from 'mobx';

import { ICategory, ICategoryPrototype } from '../../types/category';
import { IDeletable, ISelectable } from '../../types';
import { IUnit } from '../../types/unit';
import { IUser } from '../../types/user';

export class Category implements ICategory, IDeletable {
  readonly id: string;
  name: string;
  parent: ICategory | null;
  categoryPrototype: ICategoryPrototype | null;
  isEnabled: boolean;
  isSystem: boolean;
  note: string;
  unit: IUnit | null;

  readonly user: IUser;

  isDeleting: boolean;

  constructor({ id, name, parent, categoryPrototype, isEnabled, isSystem, note, user, unit }: ICategory) {
    this.id = id;
    this.name = name;
    this.parent = parent;
    this.categoryPrototype = categoryPrototype;
    this.isEnabled = isEnabled;
    this.isSystem = isSystem;
    this.note = note;
    this.parent = parent;
    this.user = user;
    this.unit = unit;

    this.isDeleting = false;

    makeObservable(this, {
      name: observable,
      parent: observable,
      isEnabled: observable,
      isDeleting: observable,
    });
  }

  get path(): string[] {
    let category: ICategory | null = this;
    const path: string[] = [];
    while (category) {
      path.push(category.id);
      category = category.parent;
    }
    return path.reverse();
  }

  get namePath(): string[] {
    let category: ICategory | null = this;
    const path: string[] = [];
    while (category) {
      path.push(category.name);
      category = category.parent;
    }

    return path.reverse();
  }

  fullPath(isIncludeOwnName = false): string {
    const names = this.namePath;
    if (isIncludeOwnName) {
      return names.join(' → ');
    }
    names.pop();
    return names.join(' → ');
  }
}
