import { JSONSchema, Model, Validator } from 'objection';

import { ICategoryPrototype, IPublicCategoryPrototype } from '../types';
import { ajvValidator } from '../../../libs/ajv';
import { categoryPrototypeSchema } from './category-prototype.schema';

export class CategoryPrototype extends Model implements ICategoryPrototype {
  static tableName = 'cf$.category_prototype';
  static jsonSchema = categoryPrototypeSchema as JSONSchema;

  readonly idCategoryPrototype: number;
  name: string;
  parent: number | null;
  isEnabled: boolean;
  isSystem: boolean;

  static createValidator(): Validator {
    return ajvValidator;
  }

  toPublicModel(): IPublicCategoryPrototype {
    return {
      id: String(this.idCategoryPrototype),
      name: this.name,
      parent: this.parent ? String(this.parent) : null,
    };
  }
}
