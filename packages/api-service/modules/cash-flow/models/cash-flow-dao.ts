import { JSONSchema, Model, Validator } from 'objection';

import { CashFlowType, ICashFlowDAO } from '../types';
import { TDateTime } from '../../../types/app';
import { ajvValidator } from '../../../libs/ajv';

import { cashFlowDAOSchema } from './cash-flow-dao.schema';

export class CashFlowDAO extends Model implements ICashFlowDAO {
  static tableName = 'cf$.v_cashflow_v2';
  static jsonSchema = cashFlowDAOSchema as JSONSchema;
  static idColumn = ['projectId', 'id'];
  static jsonAttributes = [];

  readonly projectId: number;
  readonly id: number;
  readonly contractorId: number | null;
  readonly userId: number;
  cashflowTypeId: CashFlowType;
  note: string | null;
  tags: number[] | null;
  updatedAt: TDateTime;

  static createValidator(): Validator {
    return ajvValidator;
  }

  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext);
    // this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  async $beforeUpdate(opt, queryContext) {
    await super.$beforeUpdate(opt, queryContext);
    this.updatedAt = new Date().toISOString();
  }
}
