import { ICategoryPrototype, ICategoryPrototypeEntity } from '../types';
import { TI18nField } from '../../../types/app';

export class CategoryPrototype implements ICategoryPrototype {
  id: string;
  name: TI18nField<string>;
  parent: string | null;
  isEnabled: boolean;
  isSystem: boolean;

  constructor({ id, name, parent, isEnabled, isSystem }: ICategoryPrototypeEntity) {
    this.id = id;
    this.name = name;
    this.parent = parent;
    this.isEnabled = isEnabled;
    this.isSystem = isSystem;
  }
}
