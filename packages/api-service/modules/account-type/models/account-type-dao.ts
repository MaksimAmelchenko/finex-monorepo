import { JSONSchema, Model, Validator } from 'objection';

import { IAccountType } from '../types';
import { accountTypeDAOSchema } from './account-type-dao.schema';
import { ajvValidator } from '../../../libs/ajv';
import { TI18nField } from '../../../types/app';

export class AccountTypeDAO extends Model implements IAccountType {
  static tableName = 'cf$.account_type';
  static jsonSchema = accountTypeDAOSchema as JSONSchema;
  static jsonAttributes = ['name'];

  readonly id: number;
  name: TI18nField<string>;

  static createValidator(): Validator {
    return ajvValidator;
  }
}
