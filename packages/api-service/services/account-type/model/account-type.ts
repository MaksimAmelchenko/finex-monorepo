import { JSONSchema, Model, Validator } from 'objection';

import { IAccountType, IPublicAccountType } from '../types';
import { accountTypeSchema } from './account-type.schema';
import { ajvValidator } from '../../../libs/ajv';

export class AccountType extends Model implements IAccountType {
  static tableName = 'cf$.account_type';
  static jsonSchema = accountTypeSchema as JSONSchema;

  readonly idAccountType: number;
  name: string;
  shortName: string;

  static createValidator(): Validator {
    return ajvValidator;
  }

  toPublicModel(): IPublicAccountType {
    return {
      id: String(this.idAccountType),
      name: this.name,
      shortName: this.shortName,
    };
  }
}
