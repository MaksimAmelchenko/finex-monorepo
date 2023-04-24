import { JSONSchema, Model, Validator } from 'objection';

import { ICategoryPrototypeDAO } from '../types';
import { TI18nField } from '../../../types/app';
import { ajvValidator } from '../../../libs/ajv';

import { categoryPrototypeDAOSchema } from './category-prototype-dao.schema';

export class CategoryPrototypeDAO extends Model implements ICategoryPrototypeDAO {
  static tableName = 'cf$.category_prototype';
  static jsonSchema = categoryPrototypeDAOSchema as JSONSchema;
  static jsonAttributes = ['name'];

  idCategoryPrototype: number;
  name: TI18nField<string>;
  parent: number | null;
  isEnabled: boolean;
  isSystem: boolean;

  static createValidator(): Validator {
    return ajvValidator;
  }
}
