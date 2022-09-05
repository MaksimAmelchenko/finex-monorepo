import { JSONSchema, Model, Validator } from 'objection';

import { IProfile, IPublicUser, IUser } from '../types';
import { ajvValidator } from '../../../libs/ajv';
import { userSchema } from './user.schema';

export class User extends Model implements IUser {
  static tableName = 'core$.user';
  static jsonSchema = userSchema as JSONSchema;
  static idColumn = ['idUser'];

  readonly idUser: number;
  name: string;
  email: string;
  password: string;
  tz: string | null;
  timeout: string;
  idHousehold: number;
  idProject: number | null;
  idCurrencyRateSource: number;
  createdAt: string;
  updatedAt: string;

  static createValidator(): Validator {
    return ajvValidator;
  }

  $beforeInsert() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  toPublicModel(): IPublicUser {
    return {
      id: String(this.idUser),
      name: this.name,
      email: this.email,
    };
  }

  toProfileModel(): IProfile {
    return {
      id: String(this.idUser),
      name: this.name,
      email: this.email,
      tz: this.tz,
      timeout: this.timeout,
      projectId: this.idProject ? String(this.idProject) : null,
      currencyRateSourceId: String(this.idCurrencyRateSource),
    };
  }
}
