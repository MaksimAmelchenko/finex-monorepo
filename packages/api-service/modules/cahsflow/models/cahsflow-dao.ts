import { JSONSchema, Model, Validator } from 'objection';

import { CashFlowType, ICashFlowDAO } from '../types';
import { TDateTime } from '../../../types/app';
import { ajvValidator } from '../../../libs/ajv';

import { cashFlowDaoSchema } from './cashflow-dao.schema';

export class CashFlowDAO extends Model implements ICashFlowDAO {
  static tableName = 'cf$.v_cashflow_v2';
  static jsonSchema = cashFlowDaoSchema as JSONSchema;
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

  $beforeInsert() {
    // this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}
