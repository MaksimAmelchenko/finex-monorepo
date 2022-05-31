import { ICategory, ICategoryPrototype } from '../../types/category';

export class CategoryPrototype implements ICategoryPrototype {
  readonly id: string;
  readonly name: string;
  readonly parent: CategoryPrototype | null;

  constructor({ id, name, parent }: ICategoryPrototype) {
    this.id = id;
    this.name = name;
    this.parent = parent;
  }

  get namePath(): string[] {
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
