import { JSONSchema, Model, Validator } from 'objection';

import { IUserDAO } from '../types';
import { ajvValidator } from '../../../libs/ajv';
import { userDAOSchema } from './user-dao.schema';

export class UserDAO extends Model implements IUserDAO {
  static tableName = 'core$.user';
  static jsonSchema = userDAOSchema as JSONSchema;
  static idColumn = ['idUser'];

  readonly idUser: number;
  name: string;
  email: string;
  password: string;
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
}
