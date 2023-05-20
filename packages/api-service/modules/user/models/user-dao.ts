import { JSONSchema, Model, Validator } from 'objection';

import { IUserDAO } from '../types';
import { ajvValidator } from '../../../libs/ajv';
import { userDAOSchema } from './user-dao.schema';
import { TDateTime } from '../../../types/app';

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
  accessUntil: TDateTime;
  createdAt: string;
  updatedAt: string;

  static createValidator(): Validator {
    return ajvValidator;
  }

  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext);
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  async $beforeUpdate(opt, queryContext) {
    await super.$beforeUpdate(opt, queryContext);
    this.updatedAt = new Date().toISOString();
  }
}
