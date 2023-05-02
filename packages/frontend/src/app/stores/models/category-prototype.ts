import { ICategoryPrototype } from '../../types/category';

export class CategoryPrototype implements ICategoryPrototype {
  readonly id: string;
  readonly name: string;
  readonly parent: CategoryPrototype | null;
  isEnabled: boolean;
  isSystem: boolean;


  constructor({ id, name, parent, isEnabled, isSystem }: ICategoryPrototype) {
    this.id = id;
    this.name = name;
    this.parent = parent;
    this.isEnabled = isEnabled;
    this.isSystem = isSystem;
  }

  get namePath(): string[] {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let categoryPrototype: CategoryPrototype | null = this;
    const path: string[] = [];
    while (categoryPrototype) {
      path.push(categoryPrototype.name);
      categoryPrototype = categoryPrototype.parent;
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
