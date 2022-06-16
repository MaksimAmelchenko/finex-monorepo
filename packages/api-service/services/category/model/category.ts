import { JSONSchema, Model, Validator } from 'objection';

import { ICategory, IPublicCategory } from '../types';
import { ajvValidator } from '../../../libs/ajv';
import { categorySchema } from './category.schema';

export class Category extends Model implements ICategory {
  static tableName = 'cf$.category';
  static jsonSchema = categorySchema as JSONSchema;
  static idColumn = ['idProject', 'idCategory'];

  readonly idProject: number;
  readonly idCategory: number;
  readonly idCategoryPrototype: number | null;
  readonly parent: number | null;
  readonly idUser: number;
  name: string;
  note: string | null;

  isEnabled: boolean;
  isSystem: boolean;

  static createValidator(): Validator {
    return ajvValidator;
  }

  toPublicModel(): IPublicCategory {
    return {
      id: String(this.idCategory),
      name: this.name,
      parent: this.parent ? String(this.parent) : null,
      categoryPrototypeId: this.idCategoryPrototype ? String(this.idCategoryPrototype) : null,
      isEnabled: this.isEnabled,
      isSystem: this.isSystem,
      note: this.note ?? '',
      userId: String(this.idUser),
    };
  }
}
