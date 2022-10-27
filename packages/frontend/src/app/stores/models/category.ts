import { computed, makeObservable, observable } from 'mobx';

import { CategoryPrototype } from './category-prototype';
import { ICategory } from '../../types/category';
import { IDeletable } from '../../types';
import { IUser } from '../../types/user';

export class Category implements ICategory, IDeletable {
  readonly id: string;
  name: string;
  parent: Category | null;
  categoryPrototype: CategoryPrototype | null;
  isEnabled: boolean;
  isSystem: boolean;
  note: string;

  readonly user: IUser;

  isDeleting: boolean;

  constructor({ id, name, parent, categoryPrototype, isEnabled, isSystem, note, user }: ICategory) {
    this.id = id;
    this.name = name;
    this.parent = parent;
    this.categoryPrototype = categoryPrototype;
    this.isEnabled = isEnabled;
    this.isSystem = isSystem;
    this.note = note;
    this.parent = parent;
    this.user = user;

    this.isDeleting = false;

    makeObservable(this, {
      name: observable,
      parent: observable,
      isEnabled: observable,
      isDeleting: observable,
      path: computed,
      idsPath: computed,
      namePath: computed,
    });
  }

  get path(): Category[] {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let category: Category | null = this;
    const path: Category[] = [];
    while (category) {
      path.push(category);
      category = category.parent;
    }
    return path.reverse();
  }

  get namePath(): string[] {
    return this.path.map(({ name }) => name);
  }

  get idsPath(): string[] {
    return this.path.map(({ id }) => id);
  }

  fullPath(isIncludeOwnName = false): string {
    const names = this.namePath;
    if (!isIncludeOwnName) {
      names.pop();
    }
    return names.join(' → ');
  }
}
