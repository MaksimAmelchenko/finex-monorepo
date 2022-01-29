import { ICategoryPrototype } from '../../types/category';

export class CategoryPrototype implements ICategoryPrototype {
  readonly id: string;
  readonly name: string;
  readonly parent: ICategoryPrototype | null;

  constructor({ id, name, parent }: ICategoryPrototype) {
    this.id = id;
    this.name = name;
    this.parent = parent;
  }
}
