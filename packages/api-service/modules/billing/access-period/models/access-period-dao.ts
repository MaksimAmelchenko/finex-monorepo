import { JSONSchema, Model, Validator } from 'objection';

import { IAccessPeriodDAO } from '../types';
import { TDateTime } from '../../../../types/app';
import { ajvValidator } from '../../../../libs/ajv';

import { accessPeriodDAOSchema } from './access-period-dao.schema';

export class AccessPeriodDAO extends Model implements IAccessPeriodDAO {
  static tableName = 'billing$.access_period';
  static jsonSchema = accessPeriodDAOSchema as JSONSchema;
  static jsonAttributes = [];

  id: string;
  userId: number;
  planId: string;
  startAt: TDateTime;
  endAt: TDateTime;
  createdAt: TDateTime;
  updatedAt: TDateTime;

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
