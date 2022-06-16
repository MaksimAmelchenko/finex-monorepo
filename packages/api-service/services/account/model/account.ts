import { JSONSchema, Model, Validator } from 'objection';

import { IAccount, IPublicAccount } from '../types';
import { Permit } from '../../../types/app';
import { accountSchema } from './account.schema';
import { ajvValidator } from '../../../libs/ajv';

export class Account extends Model implements IAccount {
  static tableName = 'cf$.account';
  static jsonSchema = accountSchema as JSONSchema;
  static idColumn = ['idProject', 'idAccount'];

  readonly idProject: number;
  readonly idAccount: number;
  readonly idAccountType: number;
  readonly idUser: number;
  name: string;
  note: string | null;
  isEnabled: boolean;
  permit: Permit;
  viewers: number[];
  editors: number[];

  static createValidator(): Validator {
    return ajvValidator;
  }

  toPublicModel(): IPublicAccount {
    return {
      id: String(this.idAccount),
      accountTypeId: String(this.idAccountType),
      userId: String(this.idUser),
      name: this.name,
      note: this.note ?? '',
      isEnabled: this.isEnabled,
      permit: this.permit,
      viewers: this.viewers.map(String),
      editors: this.editors.map(String),
    };
  }
}
