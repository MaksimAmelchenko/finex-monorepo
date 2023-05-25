import { JSONSchema, Model, Validator } from 'objection';

import { IAccountDAO } from '../types';
import { TDate, TDateTime } from '../../../types/app';
import { ajvValidator } from '../../../libs/ajv';
import { accountDAOSchema } from './account-dao.schema';

export class AccountDAO extends Model implements IAccountDAO {
  static tableName = 'cf$_connection.account';
  static jsonSchema = accountDAOSchema as JSONSchema;
  static idColumn = ['projectId', 'id'];

  projectId: number;
  userId: number;
  id: string;
  connectionId: string;
  providerAccountId: string;
  providerAccountName: string;
  providerAccountProduct: string | null;
  accountId: number | null;
  syncFrom: TDate | null;
  lastSyncedAt: TDateTime | null;
  createdAt: TDateTime;
  updatedAt: TDateTime;

  static createValidator(): Validator {
    return ajvValidator;
  }

  async $beforeUpdate(opt, queryContext) {
    await super.$beforeUpdate(opt, queryContext);
    this.updatedAt = new Date().toISOString();
  }
}
