import { ICategory, ICategoryPrototype } from '../../types/category';
import { IUnit } from '../../types/unit';
import { IUser } from '../../types/user';

export class Category implements ICategory {
  readonly id: string;
  name: string;
  parent: ICategory | null;
  categoryPrototype: ICategoryPrototype | null;
  isEnabled: boolean;
  isSystem: boolean;
  note: string;
  unit: IUnit | null;
  readonly user: IUser;

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
  }
}
