import { JSONSchema, Model, Validator } from 'objection';

import { ITransactionDAO } from '../types';
import { TDate, TDateTime } from '../../../types/app';
import { ajvValidator } from '../../../libs/ajv';
import { transactionDAOSchema } from './transaction-dao.schema';

export class TransactionDAO extends Model implements ITransactionDAO {
  static tableName = 'cf$_connection.transaction';
  static jsonSchema = transactionDAOSchema as JSONSchema;
  static idColumn = ['projectId', 'providerTransactionId'];
  static jsonAttributes = ['source'];

  projectId: number;
  providerTransactionId: string;
  userId: number;
  cashFlowId: number | null;
  amount: number;
  currency: string;
  transactionDate: TDate;
  transformationName: string;
  source: any;

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
